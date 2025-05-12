package service

import (
	"context"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
	"github.com/baoerzuikeai/Imsystem/internal/repository/interfaces"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FileService interface {
	UploadFile(ctx context.Context, uploaderID ,chatID string, fileHeader *multipart.FileHeader) (*domain.File, error)
}

type fileService struct {
	fileRepo interfaces.FileRepository
	basePath string // 文件存储的基础路径
}

func NewFileService(fileRepo interfaces.FileRepository, basePath string) FileService {
	return &fileService{
		fileRepo: fileRepo,
		basePath: basePath,
	}
}

func (s *fileService) UploadFile(ctx context.Context, uploaderID,chatID string, fileHeader *multipart.FileHeader) (*domain.File, error) {
	// 打开上传的文件
	file, err := fileHeader.Open()
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// 生成文件存储路径
	fileID := primitive.NewObjectID()
	fileName := fileID.Hex() + filepath.Ext(fileHeader.Filename)
	filePath := filepath.Join(s.basePath, fileName)

	// 创建目标文件
	out, err := os.Create(filePath)
	if err != nil {
		return nil, err
	}
	defer out.Close()

	// 将上传的文件内容写入目标文件
	if _, err := out.ReadFrom(file); err != nil {
		return nil, err
	}
	var chatObjID *primitive.ObjectID
	if chatID != "" {
		objID, err := primitive.ObjectIDFromHex(chatID)
		if err != nil {
			return nil, err
		}
		chatObjID = &objID
	}
	// 保存文件信息到数据库
	uploaderObjID, err := primitive.ObjectIDFromHex(uploaderID)
	if err != nil {
		return nil, err
	}

	fileRecord := &domain.File{
		ID:         fileID,
		Name:       fileHeader.Filename,
		Type:       fileHeader.Header.Get("Content-Type"),
		Size:       fileHeader.Size,
		URL:        filePath,
		ChatID:    chatObjID,
		UploaderID: uploaderObjID,
		CreatedAt:  time.Now(),
	}

	if err := s.fileRepo.Save(ctx, fileRecord); err != nil {
		return nil, err
	}

	return fileRecord, nil
}
