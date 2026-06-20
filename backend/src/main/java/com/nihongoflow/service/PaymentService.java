package com.nihongoflow.service;

import com.nihongoflow.dto.PaymentDto;
import com.nihongoflow.entity.Course;
import com.nihongoflow.entity.Payment;
import com.nihongoflow.entity.User;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.CourseRepository;
import com.nihongoflow.repository.PaymentRepository;
import com.nihongoflow.repository.UserRepository;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_SUCCESS = "SUCCESS";
    private static final String STATUS_FAILED  = "FAILED";

    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final VnpayService vnpayService;
    private final EnrollmentService enrollmentService;

    public PaymentService(
            PaymentRepository paymentRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            VnpayService vnpayService,
            EnrollmentService enrollmentService) {
        this.paymentRepository = paymentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.vnpayService = vnpayService;
        this.enrollmentService = enrollmentService;
    }

    @Transactional
    public PaymentDto createPayment(Long courseId, Long userId, String ipAddr) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Khoá học không tồn tại."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("Người dùng không tồn tại."));

        // Khóa học miễn phí → enroll trực tiếp
        if (course.getPrice() == 0) {
            enrollmentService.enroll(courseId, user);
            return new PaymentDto(courseId, 0L, STATUS_SUCCESS, null);
        }

        // Đã thanh toán thành công trước đó → enroll lại nếu chưa
        if (paymentRepository.existsByUserIdAndCourseIdAndStatus(userId, courseId, STATUS_SUCCESS)) {
            enrollmentService.enroll(courseId, user);
            return new PaymentDto(courseId, course.getPrice(), STATUS_SUCCESS, null);
        }

        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        String orderInfo = "Thanh toan khoa hoc " + courseId;

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setCourse(course);
        payment.setAmount(course.getPrice());
        payment.setVnpTxnRef(txnRef);
        payment.setStatus(STATUS_PENDING);
        paymentRepository.save(payment);

        String url = vnpayService.buildPaymentUrl(txnRef, course.getPrice(), orderInfo, ipAddr);
        return new PaymentDto(courseId, course.getPrice(), STATUS_PENDING, url);
    }

    public record ReturnResult(Long courseId, boolean success) {}

    @Transactional
    public ReturnResult handleVnpayReturn(Map<String, String> params) {
        String txnRef = params.get("vnp_TxnRef");
        Payment payment = paymentRepository.findByVnpTxnRef(txnRef)
                .orElseThrow(() -> ApiException.notFound("Giao dịch không tồn tại."));

        boolean validHash = vnpayService.verifyReturn(params);
        boolean vnpaySuccess = "00".equals(params.get("vnp_ResponseCode"));

        if (validHash && vnpaySuccess) {
            payment.setStatus(STATUS_SUCCESS);
            payment.setVnpTxnId(params.get("vnp_TransactionNo"));
            payment.setPaidAt(Instant.now());
            paymentRepository.save(payment);
            enrollmentService.enroll(payment.getCourse().getId(), payment.getUser());
            return new ReturnResult(payment.getCourse().getId(), true);
        } else {
            payment.setStatus(STATUS_FAILED);
            paymentRepository.save(payment);
            return new ReturnResult(payment.getCourse().getId(), false);
        }
    }
}
