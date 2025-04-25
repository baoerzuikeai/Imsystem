mockgen -source=internal/repository/interfaces/messagerepository.go \
        -source=internal/repository/interfaces/userrepository.go \
        -destination=internal/repository/mocks/repository_mocks.go \
        -package=mocks