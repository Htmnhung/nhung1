const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            mainTitle: 'Sửa thông tin cửa hàng',
            id: '',
            name: '',
            description: '',
            currency: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            phoneNumber: '',
            faxNumber: '',
            emailAddress: '',
            website: '',
            errors: {
                name: '',
                currency: '',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                phoneNumber: '',
                emailAddress: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const nameRef = Vue.ref(null);
        const currencyRef = Vue.ref(null);
        const streetRef = Vue.ref(null);
        const cityRef = Vue.ref(null);
        const stateRef = Vue.ref(null);
        const zipCodeRef = Vue.ref(null);
        const countryRef = Vue.ref(null);
        const phoneNumberRef = Vue.ref(null);
        const faxNumberRef = Vue.ref(null);
        const emailAddressRef = Vue.ref(null);
        const websiteRef = Vue.ref(null);

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/Company/GetCompanyList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (
                id, name, description, currency, street, city, state, zipCode, country,
                phoneNumber, faxNumber, emailAddress, website, updatedById
            ) => {
                try {
                    const response = await AxiosManager.post('/Company/UpdateCompany', {
                        id,
                        name,
                        description,
                        currency,
                        street,
                        city,
                        state,
                        zipCode,
                        country,
                        phoneNumber,
                        faxNumber,
                        emailAddress,
                        website,
                        updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
        };

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
                        { field: 'name', headerText: 'Tên cửa hàng / Công ty', width: 150, minWidth: 150 },
                        { field: 'currency', headerText: 'Tiền tệ', width: 150, minWidth: 150 },
                        { field: 'street', headerText: 'Đường phố', width: 150, minWidth: 150 },
                        { field: 'phoneNumber', headerText: 'Số điện thoại', width: 150, minWidth: 150 },
                        { field: 'emailAddress', headerText: 'Email', width: 150, minWidth: 150 },
                        { field: 'createdAtUtc', headerText: 'Ngày tạo', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],
                    toolbar: [
                        'ExcelExport', 'Search',
                        { type: 'Separator' },
                        { text: 'Sửa', tooltipText: 'Sửa thông tin', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { type: 'Separator' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom'], false);
                        mainGrid.obj.autoFitColumns(['name', 'currency', 'street', 'phoneNumber', 'emailAddress', 'createdAtUtc']);
                    },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (mainGrid.obj.getSelectedRecords().length === 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (mainGrid.obj.getSelectedRecords().length === 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom'], false);
                        }
                    },
                    rowSelecting: () => {
                        if (mainGrid.obj.getSelectedRecords().length) {
                            mainGrid.obj.clearSelection();
                        }
                    },
                    toolbarClick: (args) => {
                        if (args.item.id === 'MainGrid_excelexport') {
                            mainGrid.obj.excelExport();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.id = selectedRecord.id ?? '';
                                state.name = selectedRecord.name ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.currency = selectedRecord.currency ?? '';
                                state.street = selectedRecord.street ?? '';
                                state.city = selectedRecord.city ?? '';
                                state.state = selectedRecord.state ?? '';
                                state.zipCode = selectedRecord.zipCode ?? '';
                                state.country = selectedRecord.country ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.faxNumber = selectedRecord.faxNumber ?? '';
                                state.emailAddress = selectedRecord.emailAddress ?? '';
                                state.website = selectedRecord.website ?? '';
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

        const methods = {
            populateMainData: async () => {
                const response = await services.getMainData();
                const formattedData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
                state.mainData = formattedData;
            },
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

        const nameText = {
            obj: null,
            create: () => {
                nameText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập tên cửa hàng',
                });
                nameText.obj.appendTo(nameRef.value);
            },
            refresh: () => {
                if (nameText.obj) {
                    nameText.obj.value = state.name;
                }
            }
        };

        const currencyText = {
            obj: null,
            create: () => {
                currencyText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập tiền tệ',
                });
                currencyText.obj.appendTo(currencyRef.value);
            },
            refresh: () => {
                if (currencyText.obj) {
                    currencyText.obj.value = state.currency;
                }
            }
        };

        const streetText = {
            obj: null,
            create: () => {
                streetText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập tên đường',
                });
                streetText.obj.appendTo(streetRef.value);
            },
            refresh: () => {
                if (streetText.obj) {
                    streetText.obj.value = state.street;
                }
            }
        };

        const cityText = {
            obj: null,
            create: () => {
                cityText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập thành phố',
                });
                cityText.obj.appendTo(cityRef.value);
            },
            refresh: () => {
                if (cityText.obj) {
                    cityText.obj.value = state.city;
                }
            }
        };

        const stateText = {
            obj: null,
            create: () => {
                stateText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập tỉnh / bang',
                });
                stateText.obj.appendTo(stateRef.value);
            },
            refresh: () => {
                if (stateText.obj) {
                    stateText.obj.value = state.state;
                }
            }
        };

        const zipCodeText = {
            obj: null,
            create: () => {
                zipCodeText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập mã bưu điện',
                });
                zipCodeText.obj.appendTo(zipCodeRef.value);
            },
            refresh: () => {
                if (zipCodeText.obj) {
                    zipCodeText.obj.value = state.zipCode;
                }
            }
        };

        const countryText = {
            obj: null,
            create: () => {
                countryText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập quốc gia',
                });
                countryText.obj.appendTo(countryRef.value);
            },
            refresh: () => {
                if (countryText.obj) {
                    countryText.obj.value = state.country;
                }
            }
        };

        const phoneNumberText = {
            obj: null,
            create: () => {
                phoneNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập số điện thoại',
                });
                phoneNumberText.obj.appendTo(phoneNumberRef.value);
            },
            refresh: () => {
                if (phoneNumberText.obj) {
                    phoneNumberText.obj.value = state.phoneNumber;
                }
            }
        };

        const faxNumberText = {
            obj: null,
            create: () => {
                faxNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập số fax',
                });
                faxNumberText.obj.appendTo(faxNumberRef.value);
            },
            refresh: () => {
                if (faxNumberText.obj) {
                    faxNumberText.obj.value = state.faxNumber;
                }
            }
        };

        const emailAddressText = {
            obj: null,
            create: () => {
                emailAddressText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập địa chỉ email',
                });
                emailAddressText.obj.appendTo(emailAddressRef.value);
            },
            refresh: () => {
                if (emailAddressText.obj) {
                    emailAddressText.obj.value = state.emailAddress;
                }
            }
        };

        const websiteText = {
            obj: null,
            create: () => {
                websiteText.obj = new ej.inputs.TextBox({
                    placeholder: 'Nhập website',
                });
                websiteText.obj.appendTo(websiteRef.value);
            },
            refresh: () => {
                if (websiteText.obj) {
                    websiteText.obj.value = state.website;
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
            () => state.currency,
            (newVal, oldVal) => {
                state.errors.currency = '';
                currencyText.refresh();
            }
        );

        Vue.watch(
            () => state.street,
            (newVal, oldVal) => {
                state.errors.street = '';
                streetText.refresh();
            }
        );

        Vue.watch(
            () => state.city,
            (newVal, oldVal) => {
                state.errors.city = '';
                cityText.refresh();
            }
        );

        Vue.watch(
            () => state.state,
            (newVal, oldVal) => {
                state.errors.state = '';
                stateText.refresh();
            }
        );

        Vue.watch(
            () => state.zipCode,
            (newVal, oldVal) => {
                state.errors.zipCode = '';
                zipCodeText.refresh();
            }
        );

        Vue.watch(
            () => state.country,
            (newVal, oldVal) => {
                countryText.refresh();
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
            () => state.faxNumber,
            (newVal, oldVal) => {
                faxNumberText.refresh();
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
            () => state.website,
            (newVal, oldVal) => {
                websiteText.refresh();
            }
        );

        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 200));

                    // Validation
                    let isValid = true;
                    const fieldLabels = {
                        name: 'Tên cửa hàng',
                        currency: 'Tiền tệ',
                        street: 'Đường phố',
                        city: 'Thành phố',
                        state: 'Tỉnh / Bang',
                        zipCode: 'Mã bưu điện',
                        phoneNumber: 'Số điện thoại',
                        emailAddress: 'Địa chỉ email'
                    };
                    Object.keys(state.errors).forEach(field => {
                        state.errors[field] = '';
                        if (!state[field] && ['name', 'currency', 'street', 'city', 'state', 'zipCode', 'phoneNumber', 'emailAddress'].includes(field)) {
                            state.errors[field] = `${fieldLabels[field] || field} không được để trống.`;
                            isValid = false;
                        }
                    });
 
                    if (!isValid) return;

                    const response = await services.updateMainData(
                        state.id,
                        state.name,
                        state.description,
                        state.currency,
                        state.street,
                        state.city,
                        state.state,
                        state.zipCode,
                        state.country,
                        state.phoneNumber,
                        state.faxNumber,
                        state.emailAddress,
                        state.website,
                        StorageManager.getUserId()
                    );

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();
                        Swal.fire({
                            icon: 'success',
                            title: state.deleteMode ? 'Xóa thành công' : 'Lưu thành công',
                            text: 'Trang sẽ tự động tải lại...',
                            timer: 1000,
                            showConfirmButton: false
                        });
 
                        setTimeout(() => {
                            mainModal.obj.hide();
                            location.reload();
                        }, 1000);
 
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: state.deleteMode ? 'Xóa thất bại' : 'Lưu thất bại',
                            text: response.data.message ?? 'Vui lòng kiểm tra thông tin.',
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
            },
        };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['Companies']);
                await SecurityManager.validateToken();
                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                nameText.create();
                currencyText.create();
                streetText.create();
                cityText.create();
                stateText.create();
                zipCodeText.create();
                countryText.create();
                phoneNumberText.create();
                faxNumberText.create();
                emailAddressText.create();
                websiteText.create();

                mainModal.create();

                mainModalRef.value.addEventListener('hidden.bs.modal', () => {
                    Object.keys(state).forEach(key => {
                        if (typeof state[key] === 'string') {
                            state[key] = '';
                        }
                    });
                    state.errors = {
                        name: '',
                        currency: '',
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        phoneNumber: '',
                        emailAddress: ''
                    };
                });
            } catch (e) {
                console.error('page init error:', e);
            } finally {
                
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', () => { });
        });

        return {
            state,
            mainGridRef,
            mainModalRef,
            nameRef,
            currencyRef,
            streetRef,
            cityRef,
            stateRef,
            zipCodeRef,
            countryRef,
            phoneNumberRef,
            faxNumberRef,
            emailAddressRef,
            websiteRef,
            handler
        };
    }
};

Vue.createApp(App).mount('#app');