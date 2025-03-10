import { axiosInstance, uploadInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';
import { FileResponse } from '../../types/fileResponse';


export const getProfileImage = async (): Promise<FileResponse | null> => {
  console.log('getProfileImage 함수 호출됨'); 

  try {
    console.log('이미지 정보 요청 URL:', apiConfig.endpoints.core.getProfileImageInfo);
    const infoResponse = await axiosInstance.get(apiConfig.endpoints.core.getProfileImageInfo);

    console.log('이미지 정보 응답:', infoResponse);

    if (infoResponse.data?.data?.imageUrl) {
      const imageUrl = infoResponse.data.data.imageUrl;
      const filename = imageUrl.split('/image/')[1];
      console.log("imageUrl", imageUrl);
      console.log('이미지 파일명:', filename);

      try {
        const imageResponse = await axiosInstance.get(
          `${apiConfig.endpoints.core.getProfileImage}/${filename}`,
          {
            responseType: 'arraybuffer'
          }
        );

        const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
        
        const blob = new Blob([imageResponse.data], { type: contentType });

        const imageFile = new File([blob], filename, { type: contentType });

        return {
          status: 'success',
          data: {
            message: filename,
            response: imageFile
          },
          code: '200'
        };
      } catch (error) {
        console.error('이미지 파일 조회 실패:', error);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error('프로필 이미지 조회 에러:', error);
    console.error('에러 상세:', {
      message: error instanceof Error ? error.message : '알 수 없는 에러',
      status: (error as any).response?.status,
      data: (error as any).response?.data
    });
    return null;
  }
};

export const coreProfile = async (formData: FormData): Promise<FileResponse> => {
  try {
    const response = await uploadInstance.post(apiConfig.endpoints.core.uploadProfile, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data);
    if (response.data && typeof response.data === 'object') {
      return {
        status: 'success',
        data: response.data.data,
        code: response.data.code
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Profile API Error:', error);
    return {
      status: 'error',
      data: {
        message: error instanceof Error ? error.message : '이미지 처리 중 오류가 발생했습니다.',
        response: null
      },
      code: '500'
    };
  }
};
