# Agent Sync: Context Annotator (Extension)

Extension này giúp rút ngắn cầu nối giữa giao diện UI hiển thị trên trình duyệt (Web App) và hệ thống Agent AI. Cho phép lập trình viên hoặc tester trực tiếp "ghim" feedback vào các phần tử giao diện, và gửi thẳng vị trí component code tới local MCP server của hệ thống AI.

## 🚀 Cài đặt vào trình duyệt (Chrome / Edge / Brave)

1. Mở Terminal và Build phần extension để tạo ra thư mục `dist`:
   ```bash
   yarn build
   # hoặc npm run build
   ```
2. Mở trình duyệt Chrome/Edge/Brave và truy cập vào trang quản lý phần mở rộng:
   - Chrome/Brave: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Bật chế độ **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên cùng bên phải.
4. Click vào nút **Load unpacked** (Tải tiện ích đã giải nén).
5. Trỏ tới thư mục `dist` bên trong folder `extension` dự án của bạn: 
   `/home/phamhung/Work/Outsource/tool-extension-ai-agent/extension/dist`

---

## 🎯 Các Tính Năng Hiện Đại

Extension này hiện tại đã được nâng cấp để hoạt động **trên mọi trang web (cả localhost lẫn staging/production)** nhờ quyền `<all_urls>`.

### 1. Nút Trợ lý ảo Nổi (Floating Action Button)
- Khi bạn mở trang web, góc dưới bên phải màn hình sẽ có một **Icon tròn (FAB)** có hiệu ứng bóng kính (Glassmorphism).
- **Di chuyển vị trí (Drag & Snap):** Để icon không che mất nội dung giao diện Web đang làm, bạn có thể **bấm giữ và kéo thả** icon này đi bất cứ đâu. Khi thả tay ra, nó sẽ tự động chui vào góc màn hình gần nhất.
- Khi có ít nhất 1 nhãn đang được Note (Draft), nút FAB sẽ xuất hiện bộ Menu phụ khi "Lướt chuột" (Hover) qua nó: bao gồm nút **Tải Lên Đám Mây (Upload)** và nút **Xoá Toàn Bộ (Trash)**.

### 2. Thu thập ngữ cảnh (Inspect Context)
- Chỉ cần **Click (Bấm 1 lần)** vào nút tròn nổi, nó sẽ chuyển sang chế độ **Inspect** (màu chuyển sang hồng/đỏ).
- Rê chuột trên giao diện Web của bạn: Các phần tử code tạo ra UI đó sẽ được **làm nổi bật bằng một viền quang học (Pulse glow)**.
- **Để bắt đầu Note (Ghi chú):** Click vào 1 phần tử giao diện bất kỳ đang được highlight.

### 3. Ghi Ghi Chú & Lưu Trữ Nháp (Drafts)
- Ngay khi Click, một **Pop-up Form** nhập liệu sẽ hiển thị ngay tại dưới vị trí bạn bấm. Form sẽ thông báo cho bạn đường dẫn Source Code (Tên file React và dòng code tương ứng). 
- Bạn có thể **Click vào icon Copy** để chép ngay toàn bộ đường dẫn kèm theo bình luận vào Clipboard.
- Gõ feedback của bạn và nhấn `Enter` hoặc biểu tượng **Gửi**.
- Khác biệt so với bản trước: Nhãn ghim đỏ (Pin) sẽ xuất hiện trên màn hình và **được lưu lại tự động vào (Local Storage)**. Dù bạn có vô tình gõ `F5` reload lại trang mạng thì các nhãn ghim đỏ này cũng KHÔNG bao giờ bị mất!

### 4. Đẩy Data Về AI Agent (Sync Data)
- Sau khi gắn xong các To-Do trên màn hình, bạn hãy Lướt chuột vào FAB và click vào nút **Upload (Đám Mây)**.
- Extension sẽ kết nối với **Local Server của AI Agent** qua HTTP Post (`http://localhost:3846/api/annotations`).
- Giao diện sẽ thông báo **Exported to docs/todo/todo.md** bằng một Toast hiển thị nhanh và các nhãn trên UI sẽ ngay lập tức được "Dọn Rác" trả lại màn hình sạch sẽ.
- Ở phía máy chủ, Server sẽ ghi đè **kiểu nối đuôi (append)** các feedback vừa Submit vào dưới cùng của file `docs/todo/todo.md`. Dữ liệu của những ngày trước đó hoàn toàn không bị tẩy xoá.

Từ lúc này, AI Agent của bạn đã có file Markdown chứa toàn bộ vị trí click-able (Link tới source code trong VSCode) và sẽ sẵn sàng thực hiện mọi task thiết kế/chỉnh sửa UI chuẩn xác mà không cần copy paste hay mò mẫm code.

---

## 🤖 Hướng Dẫn Tích Hợp MCP Server (Cursor / Claude)

Để AI Agent thực sự "hiểu" và có thể đọc trực tiếp các nhãn dán mượt mà, bạn cần gắn Backend của Extension vào nền tảng AI (như ứng dụng **Cursor** hoặc **Claude Desktop**) dưới dạng một **MCP Server** (Model Context Protocol). 

Đừng lo, server này chạy hoàn toàn ngầm và cực kỳ nhẹ. Dưới đây là cách Setup:

### Cho Cursor IDE
1. Mở **Cursor Settings** (Cài đặt) -> Chọn tab **Features** -> Tìm mục **MCP Servers** -> Nhấn **+ Add New MCP Server**.
2. Điền thông tin cài đặt:
   - **Name:** `vibe-annotations` (hoặc tên bất kỳ bạn thích).
   - **Type:** `command`
   - **Command:** `npx --yes /đường_dẫn_tuyệt_đối_đến_thư_mục_chứa_tool/server`
     *Ví dụ: `npx --yes /home/phamhung/Work/tool-extension-ai-agent/server`* Hoặc bạn trỏ trực tiếp đường dẫn của Node: `node /home/phamhung/Work/tool-extension-ai-agent/server/src/index.js`
3. Nhấn **Save**. Lúc này Cursor sẽ tự động Boot cái Server Node.js lên chạy ngầm trên máy bạn. Tích xanh MCP sẽ nhảy lên báo hiệu kết nối thành công!

### Cho Claude Desktop
1. Mở file cấu hình MCP của ứng dụng Claude:
   - MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2. Bổ sung đoạn JSON khai báo Server sau vào mục `mcpServers`:
   ```json
   "mcpServers": {
     "vibe-annotations": {
       "command": "/home/phamhung/.nvm/versions/node/v22.19.0/bin/npx",
       "args": [
         "--yes",
         "/home/phamhung/Work/Outsource/tool-extension-ai-agent/server"
       ],
       "env": {
         "PATH": "/home/phamhung/.nvm/versions/node/v22.19.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
       },
       "disabled": false
     }
   }
   ```
   *(Lưu ý: Đổi lại đường dẫn `/home/phamhung/...` sao cho khớp chính xác với thư mục máy bạn hoặc nvm Node path bạn đang dùng).*
3. Lưu file và khởi động lại **Claude Desktop**. Biểu tượng cái cờ-lê (Tools) sẽ sáng lên với các kỹ năng của "Context Annotator".

**⚠️ LƯU Ý QUAN TRỌNG:**
Local Server này không những đóng vai trò truyền file `todo.md` cho AI xem, mà bản thân nó chính là một cái `HTTP Endpoint` listening trên cổng `localhost:3846` để đón nhận dữ liệu từ **Chrome Extension** bắn sang! Thế nên nếu bạn không bật Cursor hoặc Claude để nó nuôi MCP Server nãy giờ, hãy **chạy thủ công bằng Terminal** (`node server/src/index.js`) để Extension không bị lỗi báo Mất Mạng (Failed to Fetch) mỗi khi ấn nút Upload đám mây nhé!
