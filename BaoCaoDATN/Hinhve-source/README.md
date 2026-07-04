# Nguồn PlantUML cho các biểu đồ trong báo cáo

11 file `.puml` trong thư mục này là mã nguồn của 11 biểu đồ được báo cáo (`BaoCaoDATN/`) tham chiếu tới qua `Hinhve/`. Mỗi file đặt tên khớp với tên ảnh đích.

## Cách render thành ảnh

1. Mở https://www.plantuml.com/plantuml/uml/ (hoặc https://www.planttext.com/ nếu trang trên chậm)
2. Mở một file `.puml`, copy toàn bộ nội dung (từ `@startuml` đến `@enduml`)
3. Dán vào ô nhập của trang web, nó sẽ tự render ảnh preview bên cạnh
4. Lưu ảnh: bấm vào link "PNG" (plantuml.com hiển thị link tải PNG/SVG ngay dưới ảnh) — không cần chụp màn hình. Nếu trang không có nút tải, click phải vào ảnh → "Lưu ảnh thành..."
5. Lưu file với đúng tên (ví dụ `erd.puml` → `erd.png`) vào `BaoCaoDATN/Hinhve/`, đè lên ảnh placeholder cũ
6. Lặp lại cho cả 11 file

## Danh sách file và biểu đồ tương ứng

| File                             | Ảnh đích                        | Đối chiếu báo cáo   |
| -------------------------------- | ------------------------------- | ------------------- |
| `usecase-tongquat.puml`          | `usecase-tongquat.png`          | Chương 2, Mục 2.2.1 |
| `usecase-hoctap.puml`            | `usecase-hoctap.png`            | Mục 2.2.2           |
| `usecase-admin.puml`             | `usecase-admin.png`             | Mục 2.2.2           |
| `usecase-thanhtoan.puml`         | `usecase-thanhtoan.png`         | Mục 2.2.2           |
| `activity-hoanthanh-baihoc.puml` | `activity-hoanthanh-baihoc.png` | Mục 2.2.3           |
| `package-diagram.puml`           | `package-diagram.png`           | Mục 4.1.2           |
| `class-diagram-quiz.puml`        | `class-diagram-quiz.png`        | Mục 4.1.3, 4.2.2    |
| `class-diagram-enrollment.puml`  | `class-diagram-enrollment.png`  | Mục 4.1.3           |
| `sequence-submit-quiz.puml`      | `sequence-submit-quiz.png`      | Mục 4.2.2           |
| `sequence-enroll-payment.puml`   | `sequence-enroll-payment.png`   | Mục 4.2.2           |
| `erd.puml`                       | `erd.png`                       | Mục 4.2.3           |

Sau khi thay đủ 11 ảnh, build lại PDF (`pdflatex` → `bibtex` → `pdflatex` ×2, xem `BaoCaoDATN/DoAn.tex`) để kiểm tra ảnh hiển thị đúng vị trí và không vỡ layout.

## 8 ảnh chụp màn hình ứng dụng (`screenshot-*.png`)

Không nằm trong phạm vi các file `.puml` này — cần chạy app thật (`docker compose up -d mysql`, `mvn spring-boot:run`, `npm run dev`) rồi tự chụp các trang tương ứng.
