package com.smartcampus.common;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileStorageService {
    String storeFile(MultipartFile file) throws IOException;
    byte[] loadFileAsBytes(String fileName) throws IOException;
    void deleteFile(String fileName);
}
