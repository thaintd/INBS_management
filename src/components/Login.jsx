import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../services/axiosConfig";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { jwtDecode } from "jwt-decode";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtAbV6sMft_doFAjrLp774VZWhEavz6MQ",
  authDomain: "fir-realtime-database-49344.firebaseapp.com",
  projectId: "fir-realtime-database-49344",
  storageBucket: "fir-realtime-database-49344.appspot.com",
  messagingSenderId: "423913316379",
  appId: "1:423913316379:web:201871eb6ae9dd2a0198be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const requestNotificationPermission = async (accessToken) => {
    try {
      const status = await Notification.requestPermission();
      if (status === "granted") {
        const deviceToken = await getToken(messaging, {
          vapidKey: "BIUfDNHZV3QQtZE9wYFA7n8vJLvQzVQJm9JNTRbLqBT8t7saxVmeEB2rA7oMimn04xeB6LvHKvYLoQsv5nqar4o"
        });

        if (deviceToken) {
          console.log("Device Token:", deviceToken);
          await registerDeviceToken(deviceToken, accessToken);
        } else {
          console.error("Không có token thiết bị nào được tạo.");
        }
      } else {
        console.error("Quyền thông báo bị từ chối.");
      }
    } catch (error) {
      console.error("Lỗi khi yêu cầu quyền thông báo:", error);
    }
  };

  const registerDeviceToken = async (deviceToken, accessToken) => {
    try {
      deviceToken = "aaaaa";
      const formData = new FormData();
      formData.append("PlatformType", 1);
      formData.append("Token", deviceToken);

      await axiosInstance.post(`/api/DeviceToken`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    } catch (error) {
      console.error("⚠️ Error registering device token:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData object
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      // Gọi API đăng nhập với multipart/form-data
      const response = await axiosInstance.post("/Login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "*/*"
        }
      });

      if (response) {
        const token = response.accessToken;

        // Lưu token vào localStorage
        localStorage.setItem("token", token);

        // Decode token để lấy role sử dụng jwt-decode
        const decodedToken = jwtDecode(token);
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        // Lấy và đăng ký device token
        await requestNotificationPermission(token);

        // Điều hướng dựa trên role
        if (role === "2") {
          navigate("/admin");
        } else if (role === "1") {
          navigate("/artist");
        }
      } else {
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h3 className="mb-0">Đăng nhập</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="form-label fw-bold">
                    Tên đăng nhập
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-person"></i>
                    </span>
                    <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Nhập tên đăng nhập" />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold">
                    Mật khẩu
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Nhập mật khẩu" />
                  </div>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
