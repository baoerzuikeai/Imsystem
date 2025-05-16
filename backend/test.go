package main

import (
	"flag"
	"log"
	"net/url"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

var (
	addr        = flag.String("addr", "localhost:8080", "http service address")
	path        = flag.String("path", "/api/v1/ws", "websocket path")
	numClients  = flag.Int("clients", 100, "number of websocket clients")
	messageRate = flag.Int("rate", 1, "messages per second per client")
	testDuration = flag.Int("duration", 60, "duration of the test in seconds")
	verbose     = flag.Bool("verbose", false, "enable verbose logging")
	authToken   = flag.String("token", "", "JWT authentication token (required)") // 添加 token 参数
)

var (
	connections      int32
	messagesSent     int32
	messagesReceived int32
	errors           int32
)

func client(wg *sync.WaitGroup, clientID int, token string) {
	defer wg.Done()

	u := url.URL{Scheme: "ws", Host: *addr, Path: *path}
	if *verbose {
		log.Printf("Client %d: connecting to %s", clientID, u.String())
	}

	// 添加 Cookie 到请求头
	header := make(map[string][]string)
	if token != "" {
		header["Cookie"] = []string{"token=" + token}
	}

	c, _, err := websocket.DefaultDialer.Dial(u.String(), header)
	if err != nil {
		if *verbose {
			log.Printf("Client %d: dial error: %v", clientID, err)
		}
		atomic.AddInt32(&errors, 1)
		return
	}
	defer c.Close()

	atomic.AddInt32(&connections, 1)
	if *verbose {
		log.Printf("Client %d: connected", clientID)
	}

	done := make(chan struct{})
	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				if *verbose && websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
					// 正常关闭或服务器关闭连接，不计为错误
					log.Printf("Client %d: read error (connection closed): %v", clientID, err)
				} else if *verbose {
					log.Printf("Client %d: read error: %v", clientID, err)
					atomic.AddInt32(&errors, 1)
				}
				return
			}
			atomic.AddInt32(&messagesReceived, 1)
			if *verbose {
				log.Printf("Client %d: recv: %s", clientID, message)
			}
		}
	}()

	ticker := time.NewTicker(time.Second / time.Duration(*messageRate))
	defer ticker.Stop()

	testEndTime := time.Now().Add(time.Duration(*testDuration) * time.Second)

	for time.Now().Before(testEndTime) {
		select {
		case <-done:
			return
		case t := <-ticker.C:
			// 构建一个简单的 JSON 消息，与您后端期望的 WSMessage 结构类似
			// 请根据您的实际消息结构进行调整
			// 这里以发送一个简单的文本聊天消息为例
			msg := map[string]interface{}{
				"type":    "chat", // 对应后端 WSMessageTypeChat
				"chatId":  "67cd58d4c84c0000ea003de5", // 示例 chatId
				"content": "Hello from client " + strconv.Itoa(clientID) + " at " + t.String(),
			}
			// 如果发送其他类型的消息 (code, file), 请按需修改
			// 例如 code:
			// msg = map[string]interface{}{
			// 	"type":     "code",
			// 	"chatId":   "test-chat-id-" + strconv.Itoa(clientID % 10),
			// 	"content":  "fmt.Println(\"Hello from client " + strconv.Itoa(clientID) + "\")",
			// 	"language": "go",
			// }
			// 例如 file (注意: content 通常是 fileId, fileName 也是必需的):
			// msg = map[string]interface{}{
			// 	"type":     "file",
			// 	"chatId":   "test-chat-id-" + strconv.Itoa(clientID % 10),
			// 	"content":  "some-file-id-" + strconv.Itoa(clientID), // 假设的 fileId
			//  "fileName": "testfile.txt",
			// }

			err := c.WriteJSON(msg) // 使用 WriteJSON 更方便
			if err != nil {
				if *verbose {
					log.Printf("Client %d: write error: %v", clientID, err)
				}
				atomic.AddInt32(&errors, 1)
				return
			}
			atomic.AddInt32(&messagesSent, 1)
			if *verbose {
				log.Printf("Client %d: sent message", clientID)
			}
		}
	}

	// 测试时间结束，正常关闭连接
	if *verbose {
		log.Printf("Client %d: test duration ended, closing connection.", clientID)
	}
	err = c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	if err != nil && *verbose {
		log.Printf("Client %d: write close error: %v", clientID, err)
	}
	select {
	case <-done:
	case <-time.After(time.Second): // 等待服务器关闭连接
	}
}

func main() {
	flag.Parse()
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)

	if *authToken == "" {
		log.Fatal("Error: -token flag is required.")
		return
	}

	log.Printf("Starting WebSocket load test...")
	log.Printf("Target: ws://%s%s", *addr, *path)
	log.Printf("Number of clients: %d", *numClients)
	log.Printf("Message rate per client: %d msg/s", *messageRate)
	log.Printf("Test duration: %d seconds", *testDuration)
	log.Printf("Verbose logging: %t", *verbose)

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	var wg sync.WaitGroup

	startTime := time.Now()

	for i := 0; i < *numClients; i++ {
		wg.Add(1)
		go client(&wg, i, *authToken)
		time.Sleep(10 * time.Millisecond) // 稍微错开连接请求，避免瞬间冲击过大
	}

	log.Printf("All clients launched. Waiting for test completion or interrupt...")

	// 等待所有客户端完成或被中断
	go func() {
		wg.Wait()
		close(interrupt) // 如果所有客户端都正常结束，则关闭 interrupt 通道以结束主程序
	}()

	select {
	case <-time.After(time.Duration(*testDuration+5) * time.Second): // 比测试时间多一点，确保客户端有时间关闭
		log.Println("Test duration finished.")
	case <-interrupt:
		log.Println("Interrupt signal received, stopping clients...")
	}

	// 等待所有 goroutine 退出
	// wg.Wait() // 如果上面 select case 已经处理了 wg.Wait() 的情况，这里可以注释掉或调整

	elapsedTime := time.Since(startTime)

	log.Printf("\n--- Test Results ---")
	log.Printf("Elapsed Time: %s", elapsedTime)
	log.Printf("Total Connections Established: %d / %d", atomic.LoadInt32(&connections), *numClients)
	log.Printf("Total Messages Sent: %d", atomic.LoadInt32(&messagesSent))
	log.Printf("Total Messages Received: %d", atomic.LoadInt32(&messagesReceived))
	log.Printf("Total Errors: %d", atomic.LoadInt32(&errors))

	if atomic.LoadInt32(&connections) > 0 {
		avgMessagesSentPerConnection := float64(atomic.LoadInt32(&messagesSent)) / float64(atomic.LoadInt32(&connections))
		log.Printf("Average Messages Sent per Active Connection: %.2f", avgMessagesSentPerConnection)
	}
}