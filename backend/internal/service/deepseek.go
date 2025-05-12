package service

import (
    "bytes"
    "context"
    "encoding/json"
    "errors"
    "net/http"
)

type DeepSeekClient struct {
    apiKey string
    apiURL string
}

func NewDeepSeekClient(apiKey, apiURL string) *DeepSeekClient {
    return &DeepSeekClient{
        apiKey: apiKey,
        apiURL: apiURL,
    }
}

func (c *DeepSeekClient) GetResponse(ctx context.Context, history []struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}, question string) (string, error) {
    // 构造请求体
    requestBody, err := json.Marshal(map[string]interface{}{
        "history":  history,
        "question": question,
    })
    if err != nil {
        return "", err
    }

    // 创建 HTTP 请求
    req, err := http.NewRequestWithContext(ctx, "POST", c.apiURL, bytes.NewBuffer(requestBody))
    if err != nil {
        return "", err
    }
    req.Header.Set("Authorization", "Bearer "+c.apiKey)
    req.Header.Set("Content-Type", "application/json")

    // 发送请求
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    // 检查响应状态码
    if resp.StatusCode != http.StatusOK {
        return "", errors.New("DeepSeek 服务返回错误: " + resp.Status)
    }

    // 解析响应
    var response struct {
        Answer string `json:"answer"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
        return "", err
    }

    return response.Answer, nil
}