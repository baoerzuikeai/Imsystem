package handler

import (
    "net/http"

    "github.com/baoerzuikeai/Imsystem/internal/service"
    "github.com/gin-gonic/gin"
)

type FileHandler struct {
    fileService service.FileService
}

func NewFileHandler(fileService service.FileService) *FileHandler {
    return &FileHandler{
        fileService: fileService,
    }
}

func (h *FileHandler) UploadFile(c *gin.Context) {
    uploaderID := c.GetString("userID")
	chatID := c.Param("chatId")
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
        return
    }

    fileRecord, err := h.fileService.UploadFile(c.Request.Context(), uploaderID,chatID, file)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, fileRecord)
}