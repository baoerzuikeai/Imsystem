package middleware

import (
	"log"
	"net/http"
	"strings"

	"github.com/baoerzuikeai/Imsystem/pkg/jwt"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenStr string

		// 判断是否为 WebSocket 连接
		isWebSocket := strings.ToLower(c.GetHeader("Upgrade")) == "websocket"
		log.Println("Is WebSocket:", isWebSocket)
		if isWebSocket {
			// 尝试从 cookie 中获取 token
			cookieToken, err := c.Cookie("token")
			log.Println("Cookie Token:", cookieToken)
			if err != nil || cookieToken == "" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token is required in cookie for WebSocket connection"})
				c.Abort()
				return
			}
			tokenStr = cookieToken
		} else {
			// 正常的 HTTP 接口使用 Authorization header
			authHeader := c.GetHeader("Authorization")
			if authHeader == "" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
				c.Abort()
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if !(len(parts) == 2 && parts[0] == "Bearer") {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
				c.Abort()
				return
			}
			tokenStr = parts[1]
		}

		claims, err := jwt.ParseToken(tokenStr, jwtSecret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Next()
	}
}
