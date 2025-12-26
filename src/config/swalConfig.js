import Swal from 'sweetalert2';
import successIcon from '@/assets/images/alert_success.svg';
import errorIcon from '@/assets/images/alert_warning.svg';
import warningIcon from '@/assets/images/alert_warning.svg';
import infoIcon from '@/assets/images/alert_info.svg';
import questionIcon from '@/assets/images/alert_confirm.svg';

// 아이콘 타입별 이미지 URL 매핑
const iconImages = {
  success: successIcon,
  error: errorIcon,
  warning: warningIcon,
  info: infoIcon,
  question: questionIcon,
};

// Swal.fire를 래핑하여 아이콘을 자동으로 이미지로 교체하는 함수
export const customSwal = {
  fire: (options) => {
    // icon이 문자열로 전달된 경우 이미지 URL로 변환
    if (options.icon && typeof options.icon === 'string' && iconImages[options.icon]) {
      return Swal.fire({
        ...options,
        imageUrl: iconImages[options.icon],
        imageWidth: 80,
        imageHeight: 80,
        imageAlt: options.title || '알림',
        icon: undefined, // icon 제거하여 기본 아이콘 표시 안 함
      });
    }
    // icon이 없거나 이미 imageUrl이 있는 경우 그대로 사용
    return Swal.fire(options);
  },
};

// 전역으로 사용할 수 있도록 window에 등록
if (typeof window !== 'undefined') {
  window.customSwal = customSwal;
}

export default { iconImages, customSwal };

