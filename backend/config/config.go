package config

import (
	"github.com/spf13/viper"
)

type Config struct {
	Server  ServerConfig
	MongoDB MongoDBConfig
	JWT     JWTConfig
	AI      AIConfig
	File    FileConfig
}

type ServerConfig struct {
	Port string
	Mode string
}

type MongoDBConfig struct {
	URI      string
	Database string
}

type JWTConfig struct {
	Secret    string
	ExpiresIn int64
}

type AIConfig struct {
	APIKey string
	Model  string
	Url    string
}

type FileConfig struct {
	BasePath string
}

func LoadConfig(path string) (*Config, error) {
	viper.SetConfigFile(path)
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	config := &Config{}
	err := viper.Unmarshal(config)
	return config, err
}
