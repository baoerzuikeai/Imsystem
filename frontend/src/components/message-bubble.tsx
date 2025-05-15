// src/components/message-bubble.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { cn } from "@/lib/utils";
import type { Message, User, File as FileType } from "@/types"; // 使用别名 FileType
import { compareAsc, format } from "date-fns";
import {
  Check,
  MoreHorizontal,
  FileText,
  Play,
  Pause,
  Download,
  AlertCircle,
  Loader2,
  Image as ImageIcon, // Fallback icon for images
  Volume2, // For audio, though full functionality is complex
} from "lucide-react";
import { api as backendApiService } from "@/services/api"; // API服务

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  user?: User; // Sender's user object, for non-current user messages
  currentUserAvatar?: string; // Optional: Pass current user's avatar URL
}

// Helper function to format file size
const formatFileSize = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export function MessageBubble({
  message,
  isCurrentUser,
  user,
  currentUserAvatar,
}: MessageBubbleProps) {
  const [showOptions, setShowOptions] = useState(false);

  // State for file messages
  const [fileDetails, setFileDetails] = useState<FileType | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // State for audio playback (basic toggle)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const fileIdFromMessage =
    message.type === "file" && message.content?.fileId
  console.log("MessageBubble: fileIdFromMessage", fileIdFromMessage);
  useEffect(() => {
    // Reset state when message (and thus fileId) changes
    setFileDetails(null);
    setFileError(null);
    setIsLoadingFile(false);

    if (fileIdFromMessage) {
      const fetchFileDetails = async () => {
        setIsLoadingFile(true);
        setFileError(null);
        try {
          const fetchedFile = await backendApiService.file.getFileById(
            fileIdFromMessage,
          );
          setFileDetails(fetchedFile);

        } catch (error) {
          console.error(
            `MessageBubble: Failed to fetch file details for ${fileIdFromMessage}`,
            error,
          );
          setFileError(
            error instanceof Error
              ? error.message
              : "Failed to load file details",
          );
        } finally {
          setIsLoadingFile(false);
        }
      };
      fetchFileDetails();
    }
  }, [fileIdFromMessage]); // Depend on fileIdFromMessage

  console.log("MessageBubble: fileDetails", fileDetails);
  const toggleAudioPlay = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // Actual audio play/pause logic would involve an <audio> element ref and its methods
  };

  const handleDownload = (fileUrl?: string, fileName?: string) => {
    if (!fileUrl || !fileName) return;

    // Construct the full URL for the file
    // VITE_API_DOMAIN should be your backend's domain, e.g., http://localhost:8080
    // if fileDetails.url is like "uploads/xyz.png"
    const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || "http://localhost:8080"; // Defaults to empty if not set
    let completeFileUrl = fileUrl;
    if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
      completeFileUrl = `${API_DOMAIN}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
    }

    console.log("Attempting to download from URL:", completeFileUrl);

    const link = document.createElement("a");
    link.href = completeFileUrl;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank"); // Optional: open in new tab to download, might be better for some browsers
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderAttachment = () => {
    if (message.type !== "file" || !message.content?.fileId) return null;

    if (isLoadingFile) {
      return (
        <div className="flex items-center justify-center p-3 bg-accent rounded-md mb-1 min-h-[70px] w-full max-w-xs sm:max-w-sm">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading file info...</span>
        </div>
      );
    }

    if (fileError) {
      return (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md mb-1 text-destructive-foreground w-full max-w-xs sm:max-w-sm">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Error</p>
            <p className="text-xs truncate" title={fileError}>{fileError}</p>
          </div>
        </div>
      );
    }

    if (!fileDetails) {
      // Fallback if still no details (should be covered by loading/error)
      return (
        <div className="flex items-center gap-2 p-3 bg-accent rounded-md mb-1 min-h-[70px] w-full max-w-xs sm:max-w-sm text-muted-foreground">
          <FileText className="h-6 w-6" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {message.content.fileName}
            </p>
            <p className="text-xs">Info unavailable</p>
          </div>
        </div>
      );
    }

    // Construct display URL for images/audio sources
    const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || "http://localhost:8080";
    let displayUrl = fileDetails.url;
    if (!displayUrl.startsWith("http://") && !displayUrl.startsWith("https://")) {
      displayUrl = `${API_DOMAIN}${displayUrl.startsWith("/") ? "" : "/"}${displayUrl}`;
    }

    console.log("Display URL for file:", displayUrl);
    if (fileDetails.type.startsWith("image/")) {
      return (
        <div className="rounded-lg overflow-hidden mb-1 max-w-[280px] sm:max-w-xs relative group/image border bg-muted">
          <img
            src={displayUrl}
            alt={fileDetails.name}
            className="w-full h-auto object-contain max-h-80" // object-contain to see full image
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }} // Fallback image
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity bg-background/80 hover:bg-background text-foreground h-8 px-2"
            onClick={() => handleDownload(fileDetails.url, fileDetails.name)}
            title={`Download ${fileDetails.name}`}
          >
            <Download className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      );
    } else if (fileDetails.type.startsWith("audio/")) {
      return (
        <div className="flex items-center gap-2 p-3 bg-accent rounded-md mb-1 w-full max-w-xs sm:max-w-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex-shrink-0"
            onClick={toggleAudioPlay}
          >
            {isAudioPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate mb-1" title={fileDetails.name}>
              {fileDetails.name}
            </p>
            {/* Basic audio player structure - full functionality requires <audio> element and event handling */}
            <div className="h-1.5 bg-muted-foreground/20 rounded-full w-full">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${isAudioPlaying ? "30%" : "0%"}` }} // Placeholder progress
              ></div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatFileSize(fileDetails.size)}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => handleDownload(fileDetails.url, fileDetails.name)}
            title={`Download ${fileDetails.name}`}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    } else {
      // Default file type
      return (
        <div className="flex items-center gap-3 p-3 bg-accent rounded-md mb-1 max-w-xs sm:max-w-sm">
          <FileText className="h-9 w-9 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" title={fileDetails.name}>
              {fileDetails.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(fileDetails.size)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 sm:px-3"
            onClick={() => handleDownload(fileDetails.url, fileDetails.name)}
          >
            <Download className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      );
    }
  };

  return (
    <div
      className={cn(
        "flex w-full mb-3 sm:mb-4", // Added bottom margin
        isCurrentUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex gap-2 sm:gap-3 max-w-[calc(100%-4rem)] xs:max-w-[85%] sm:max-w-[80%] md:max-w-[75%]",
          isCurrentUser ? "flex-row-reverse" : "flex-row",
        )}
      >
        {/* Avatar */}
        {!isCurrentUser && user && (
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 mt-1">
            <AvatarImage
              src={user.avatar || "/placeholder-avatar.svg"}
              alt={user.profile.nickname || user.username}
            />
            <AvatarFallback>
              {(user.profile.nickname || user.username || "U").substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        {isCurrentUser && (
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 mt-1">
            <AvatarImage
              src={currentUserAvatar || "/placeholder-user.svg"} // Use passed prop or fallback
              alt="You"
            />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
        )}

        {/* Message Content Area */}
        <div
          className={cn(
            "flex flex-col gap-0.5", // Reduced gap between content and time
            isCurrentUser ? "items-end" : "items-start",
          )}
        >
          {/* Sender Name (Optional, for group chats if not current user) */}
          {!isCurrentUser && user && message.chatId.startsWith("group-") && ( // Example: show for group chats
            <p className="text-xs text-muted-foreground mb-0.5 ml-1 px-1">{user.profile.nickname || user.username}</p>
          )}

          {/* Attachment (File) */}
          {message.type === "file" && renderAttachment()}

          {/* Text Content */}
          {message.type === "text" && message.content.text && (
            <div
              className={cn(
                "relative group rounded-xl px-3 py-2 shadow-sm break-words w-fit", // w-fit for bubble to wrap content
                isCurrentUser
                  ? "bg-muted markdown-content rounded-br-none" // Tail for current user
                  : "bg-card border text-card-foreground rounded-bl-none", // Tail for other user
              )}
              onMouseEnter={() => setShowOptions(true)}
              onMouseLeave={() => setShowOptions(false)}
            >
              <div className="markdown-content editor-output"> {/* Added editor-output for prose styles if any */}
                {(() => {
                  // 对 chat.question 进行反转义处理
                  let processedContent = message.content.text;
                  try {
                    // 尝试将字面上的 \\n, \\t, \\" 等转换回 \n, \t, "
                    // 注意：JSON.parse 可以很好地处理这些标准的JSON字符串转义
                    // 为了安全，我们只在它看起来像一个JSON编码过的字符串时（首尾是引号）才尝试
                    // 但更简单直接的方式是字符串替换
                    processedContent = processedContent
                      .replace(/\\n/g, '\n')    // 将 '\\n' 替换为实际换行符
                      .replace(/\\t/g, '\t')    // 将 '\\t' 替换为实际制表符
                      .replace(/\\"/g, '"')     // 将 '\\"' 替换为实际引号
                      .replace(/\\\\/g, '\\');  // 将 '\\\\' 替换为实际反斜杠 (如果需要处理其他转义)

                  } catch (e) {
                    console.error("Failed to unescape user question, using original:", e);
                    // 如果解析失败，保持原始内容，虽然不太可能因为我们用的是 replace
                  }

                  // console.log("User question for MarkdownRenderer (processed):", JSON.stringify(processedContent));
                  // console.log("User question directly (processed):", processedContent);

                  return <MarkdownRenderer content={processedContent} />;
                })()}
              </div>
              {showOptions && (
                <div
                  className={cn(
                    "absolute top-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
                    isCurrentUser ? "-left-7" : "-right-7",
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-background/20"
                    title="More options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Timestamp and Read Status */}
          <div
            className={cn(
              "flex items-center gap-1 text-xs text-muted-foreground mt-0.5 px-1",
            )}
          >
            <span>{format(new Date(message.createdAt), "p")}</span>
            {isCurrentUser &&
              Array.isArray(message.readBy) &&
              message.readBy.length > 1 && ( // Assuming readBy[0] is sender, >1 means others read
                <Check className="h-3.5 w-3.5 text-blue-500" />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}