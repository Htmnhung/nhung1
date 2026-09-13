const App = {
    setup() {
        const state = Vue.reactive({
            email: '',
            password: '',
            isSubmitting: false,
            errors: {
                email: '',
                password: ''
            }
        });

        const validateForm = () => {
            state.errors.email = '';
            state.errors.password = '';
            let isValid = true;

            if (!state.email) {
                state.errors.email = 'Email không được để trống.';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(state.email)) {
                state.errors.email = 'Địa chỉ email không hợp lệ.';
                isValid = false;
            }

            if (!state.password) {
                state.errors.password = 'Mật khẩu không được để trống.';
                isValid = false;
            } else if (state.password.length < 6) {
                state.errors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự.';
                isValid = false;
            }

            return isValid;
        };

        const handleSubmit = async () => {

            try {
                state.isSubmitting = true;
                await new Promise(resolve => setTimeout(resolve, 300));

                if (!validateForm()) {
                    return;
                }

                const response = await AxiosManager.post('/Security/Login', {
                    email: state.email,
                    password: state.password
                });

                if (response.data.code === 200) {
                    StorageManager.saveLoginResult(response.data);

                    Swal.fire({
                        icon: 'success',
                        title: 'Đăng nhập thành công',
                        text: 'Bạn đang được chuyển hướng...',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    setTimeout(() => {
                        window.location.href = '/Profiles/MyProfile';
                    }, 2000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Đăng nhập thất bại',
                        text: response.data.message || 'Vui lòng kiểm tra lại thông tin đăng nhập.',
                        confirmButtonText: 'Thử lại'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Đã xảy ra lỗi',
                    text: error.response?.data?.message || 'Vui lòng thử lại.',
                    confirmButtonText: 'OK'
                });
            } finally {
                state.isSubmitting = false;
            }
        };

        return {
            state,
            handleSubmit
        };
    }
};

Vue.createApp(App).mount('#app');

