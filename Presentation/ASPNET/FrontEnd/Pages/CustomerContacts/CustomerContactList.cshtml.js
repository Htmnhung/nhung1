const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            customerListLookupData: [],
            mainTitle: null,
            id: '',
            name: '',
            jobTitle: '',
            phoneNumber: '',
            emailAddress: '',
            description: '',
            customerId: null,
            errors: {
                name: '',
                jobTitle: '',
                phoneNumber: '',
                emailAddress: '',
                customerId: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const nameRef = Vue.ref(null);
        const numberRef = Vue.ref(null);
        const jobTitleRef = Vue.ref(null);
        const phoneNumberRef = Vue.ref(null);
        const emailAddressRef = Vue.ref(null);
        const customerIdRef = Vue.ref(null);

        const validateForm = function () {
            state.errors.name = '';
            state.errors.jobTitle = '';
            state.errors.phoneNumber = '';
            state.errors.emailAddress = '';
            state.errors.customerId = '';

            let isValid = true;

            if (!state.name) {
                state.errors.name = 'Họ và tên không được để trống.';
                isValid = false;
            }
            if (!state.jobTitle) {
                state.errors.jobTitle = 'Chức vụ không được để trống.';
                isValid = false;
            }
            if (!state.phoneNumber) {
                state.errors.phoneNumber = 'Số điện thoại không được để trống.';
                isValid = false;
            }
            if (!state.emailAddress) {
                state.errors.emailAddress = 'Email không được để trống.';
                isValid = false;
            }
            if (!state.customerId) {
                state.errors.customerId = 'Vui lòng chọn khách hàng.';
                isValid = false;
            }

            return isValid;
        };

        const resetFormState = () => {
            state.id = '';
            state.name = '';
            state.number = '';
            state.jobTitle = '';
            state.phoneNumber = '';
            state.emailAddress = '';
            state.description = '';
            state.customerId = null;
            state.errors = {
                name: '',
                jobTitle: '',
                phoneNumber: '',
                emailAddress: '',
                customerId: ''
            };
        };

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/CustomerContact/GetCustomerContactList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createMainData: async (name, jobTitle, phoneNumber, emailAddress, description, customerId, createdById) => {
                try {
                    const response = await AxiosManager.post('/CustomerContact/CreateCustomerContact', {
                        name, jobTitle, phoneNumber, emailAddress, description, customerId, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (id, name, jobTitle, phoneNumber, emailAddress, description, customerId, updatedById) => {
                try {
                    const response = await AxiosManager.post('/CustomerContact/UpdateCustomerContact', {
                        id, name, jobTitle, phoneNumber, emailAddress, description, customerId, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/CustomerContact/DeleteCustomerContact', {
                        id, deletedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getCustomerListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Customer/GetCustomerList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            }
        };

        const methods = {
            populateCustomerListLookupData: async () => {
                const response = await services.getCustomerListLookupData();
                state.customerListLookupData = response?.data?.content?.data;
            },
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
        };

        const nameText = {
            obj: null,
            create: () => {
                nameText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập họ và tên'
                });
                nameText.obj.appendTo(nameRef.value);
            },
            refresh: () => {
                if (nameText.obj) {
                    nameText.obj.value = state.name;
                }
            }
        };


        const numberText = {
            obj: null,
            create: () => {
                numberText.obj = new ej.inputs.TextBox({
                    placeholder: '[Tự động]',
                    readonly: true
                });
                numberText.obj.appendTo(numberRef.value);
            },
            refresh: () => {
                if (numberText.obj) {
                    numberText.obj.value = state.number;
                }
            }
        };

        const jobTitleText = {
            obj: null,
            create: () => {
                jobTitleText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập chức vụ / công việc'
                });
                jobTitleText.obj.appendTo(jobTitleRef.value);
            },
            refresh: () => {
                if (jobTitleText.obj) {
                    jobTitleText.obj.value = state.jobTitle;
                }
            }
        };

        const phoneNumberText = {
            obj: null,
            create: () => {
                phoneNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập số điện thoại'
                });
                phoneNumberText.obj.appendTo(phoneNumberRef.value);
            },
            refresh: () => {
                if (phoneNumberText.obj) {
                    phoneNumberText.obj.value = state.phoneNumber;
                }
            }
        };

        const emailAddressText = {
            obj: null,
            create: () => {
                emailAddressText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập địa chỉ Email'
                });
                emailAddressText.obj.appendTo(emailAddressRef.value);
            },
            refresh: () => {
                if (emailAddressText.obj) {
                    emailAddressText.obj.value = state.emailAddress;
                }
            }
        };

        const customerListLookup = {
            obj: null,
            create: () => {
                if (state.customerListLookupData && Array.isArray(state.customerListLookupData)) {
                    customerListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.customerListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'Chọn khách hàng',
                        change: (e) => {
                            state.customerId = e.value;
                        }
                    });
                    customerListLookup.obj.appendTo(customerIdRef.value);
                } else {
                    console.error('Customer list lookup data is not available or invalid.');
                }
            },
            refresh: () => {
                if (customerListLookup.obj) {
                    customerListLookup.obj.value = state.customerId;
                }
            }
        };

        Vue.watch(
            () => state.name,
            (newVal, oldVal) => {
                state.errors.name = '';
                nameText.refresh();
            }
        );

        Vue.watch(
            () => state.jobTitle,
            (newVal, oldVal) => {
                state.errors.jobTitle = '';
                jobTitleText.refresh();
            }
        );

        Vue.watch(
            () => state.phoneNumber,
            (newVal, oldVal) => {
                state.errors.phoneNumber = '';
                phoneNumberText.refresh();
            }
        );

        Vue.watch(
            () => state.emailAddress,
            (newVal, oldVal) => {
                state.errors.emailAddress = '';
                emailAddressText.refresh();
            }
        );

        Vue.watch(
            () => state.customerId,
            (newVal, oldVal) => {
                state.errors.customerId = '';
                customerListLookup.refresh();
            }
        );

        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 300));

                    if (!validateForm()) {
                        return;
                    }

                    const response = state.id === ''
                        ? await services.createMainData(state.name, state.jobTitle, state.phoneNumber, state.emailAddress, state.description, state.customerId, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.name, state.jobTitle, state.phoneNumber, state.emailAddress, state.description, state.customerId, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'Sửa thông tin liên hệ';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';
                            state.name = response?.data?.content?.data.name ?? '';
                            state.jobTitle = response?.data?.content?.data.jobTitle ?? '';
                            state.phoneNumber = response?.data?.content?.data.phoneNumber ?? '';
                            state.emailAddress = response?.data?.content?.data.emailAddress ?? '';
                            state.description = response?.data?.content?.data.description ?? '';
                            state.customerId = response?.data?.content?.data.customerId ?? '';

                            Swal.fire({
                                icon: 'success',
                                title: 'Lưu thành công',
                                text: 'Hộp thoại đang đóng...',
                                timer: 2000,
                                showConfirmButton: false
                            });
                            setTimeout(() => {
                                mainModal.obj.hide();
                            }, 2000);

                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Xóa thành công',
                                text: 'Hộp thoại đang đóng...',
                                timer: 2000,
                                showConfirmButton: false
                            });
                            setTimeout(() => {
                                mainModal.obj.hide();
                                resetFormState();
                            }, 2000);
                        }

                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: state.deleteMode ? 'Xóa thất bại' : 'Lưu thất bại',
                            text: response.data.message ?? 'Vui lòng kiểm tra lại thông tin.',
                            confirmButtonText: 'Thử lại'
                        });
                    }

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Đã xảy ra lỗi',
                        text: error.response?.data?.message ?? 'Vui lòng thử lại.',
                        confirmButtonText: 'OK'
                    });
                } finally {
                    state.isSubmitting = false;
                }
            }
        };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['CustomerContacts']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);
                await methods.populateCustomerListLookupData();
                customerListLookup.create();
                nameText.create();
                numberText.create();
                jobTitleText.create();
                phoneNumberText.create();
                emailAddressText.create();

                mainModal.create();
                mainModalRef.value?.addEventListener('hidden.bs.modal', () => {
                    resetFormState();
                });

            } catch (e) {
                console.error('page init error:', e);
            } finally {
                
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', resetFormState);
        });

        const mainGrid = {
            obj: null,
            create: async (dataSource) => {
                mainGrid.obj = new ej.grids.Grid({
                    height: '240px',
                    dataSource: dataSource,
                    allowFiltering: true,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: true,
                    groupSettings: {
                        columns: ['customerName']
                    },
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: true,
                    allowExcelExport: true,
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'createdAtUtc', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "All"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: true,
                    showColumnMenu: true,
                    gridLines: 'Horizontal',
                    columns: [
                        { type: 'checkbox', width: 60 },
                        {
                            field: 'id', isPrimaryKey: true, headerText: 'Id', visible: false
                        },
                        { field: 'number', headerText: 'Mã liên hệ', width: 150, minWidth: 150 },
                        { field: 'name', headerText: 'Họ và tên', width: 200, minWidth: 200 },
                        { field: 'customerName', headerText: 'Khách hàng', width: 150, minWidth: 150 },
                        { field: 'jobTitle', headerText: 'Chức vụ', width: 150, minWidth: 150 },
                        { field: 'phoneNumber', headerText: 'Số điện thoại', width: 150, minWidth: 150 },
                        { field: 'emailAddress', headerText: 'Email', width: 150, minWidth: 150 },
                        { field: 'createdAtUtc', headerText: 'Ngày tạo', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],
                    toolbar: [
                        'ExcelExport', 'Search',
                        { type: 'Separator' },
                        { text: 'Thêm', tooltipText: 'Thêm mới', prefixIcon: 'e-add', id: 'AddCustom' },
                        { text: 'Sửa', tooltipText: 'Sửa', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { text: 'Xóa', tooltipText: 'Xóa', prefixIcon: 'e-delete', id: 'DeleteCustom' },
                        { type: 'Separator' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                        mainGrid.obj.autoFitColumns(['name', 'customerName', 'jobTitle', 'phoneNumber', 'emailAddress', 'createdAtUtc']);
                    },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                        }
                    },
                    rowSelecting: () => {
                        if (mainGrid.obj.getSelectedRecords().length) {
                            mainGrid.obj.clearSelection();
                        }
                    },
                    toolbarClick: async (args) => {
                        if (args.item.id === 'MainGrid_excelexport') {
                            mainGrid.obj.excelExport();
                        }

                        if (args.item.id === 'AddCustom') {
                            state.deleteMode = false;
                            state.mainTitle = 'Thêm liên hệ khách hàng';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Sửa liên hệ khách hàng';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.name = selectedRecord.name ?? '';
                                state.jobTitle = selectedRecord.jobTitle ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.emailAddress = selectedRecord.emailAddress ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.customerId = selectedRecord.customerId ?? '';
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Xóa liên hệ khách hàng?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.name = selectedRecord.name ?? '';
                                state.jobTitle = selectedRecord.jobTitle ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.emailAddress = selectedRecord.emailAddress ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.customerId = selectedRecord.customerId ?? '';
                                mainModal.obj.show();
                            }
                        }
                    }
                });

                mainGrid.obj.appendTo(mainGridRef.value);
            },
            refresh: () => {
                mainGrid.obj.setProperties({ dataSource: state.mainData });
            }
        };

        const mainModal = {
            obj: null,
            create: () => {
                mainModal.obj = new bootstrap.Modal(mainModalRef.value, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        };

        return {
            mainGridRef,
            mainModalRef,
            nameRef,
            numberRef,
            jobTitleRef,
            phoneNumberRef,
            emailAddressRef,
            customerIdRef,
            state,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');