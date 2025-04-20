package main

import (
	"context"
	"log"

	"github.com/baoerzuikeai/Imsystem/config"
	"github.com/baoerzuikeai/Imsystem/internal/delivery/http/handler"
	"github.com/baoerzuikeai/Imsystem/internal/delivery/middleware"
	"github.com/baoerzuikeai/Imsystem/internal/repository/mongodb"
	"github.com/baoerzuikeai/Imsystem/internal/service"
	"github.com/baoerzuikeai/Imsystem/internal/websocket"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	//加载配置
	cfg, err := config.LoadConfig("config.yaml")
	if err != nil {
		log.Fatal(err)
	}

	//连接MongoDB
	ctx := context.Background()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoDB.URI))
	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(ctx)
	db := client.Database(cfg.MongoDB.Database)

	// 初始化repositories
	userRepo := mongodb.NewUserRepository(db)
	messageRepo := mongodb.NewMessageRepository(db)
	chatRepo := mongodb.NewChatRepository(db)

	// 初始化services
	authService := service.NewAuthService(userRepo, cfg.JWT.Secret, cfg.JWT.ExpiresIn)
	messageService := service.NewMessageService(messageRepo, chatRepo)
	chatService := service.NewChatService(chatRepo) // 新增 chatService

	// 初始化 WebSocket manager
	wsManager := websocket.NewManager(messageService)
	go wsManager.Start() // 启动 WebSocket 管理器

	// 初始化 handlers
	authHandler := handler.NewAuthHandler(authService)
	wsHandler := handler.NewHandler(wsManager)
	messageHandler := handler.NewMessageHandler(messageService)
	chatHandler := handler.NewChatHandler(chatService) // 新增 chatHandler

	//设置Gin路由
	r := gin.Default()

	//配置 CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173", "http://192.168.31.186:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.AllowCredentials = true

	r.Use(cors.New(config))
	//公开路由
	public := r.Group("/api/v1")
	{
		public.POST("/auth/register", authHandler.Register)
		public.POST("/auth/login", authHandler.Login)
	}

	//
	protected := r.Group("/api/v1")
	protected.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
	{

		protected.GET("/auth/user", authHandler.GetUserDetail)
		protected.GET("/ws", wsHandler.HandleWebSocket)
		protected.GET("/chats/:chatId/messages", messageHandler.GetChatMessages)
		protected.GET("/chats/private", chatHandler.GetPrivateChatFriends)
	}

	// 启动服务器
	if err := r.Run("0.0.0.0:" + cfg.Server.Port); err != nil {
		log.Fatal(err)
	}
}
