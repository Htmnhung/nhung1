const App = {
    setup() {
        const state = Vue.reactive({
            cardsData: {},
            salesData: {},
            inventoryData: {}
        });

        const cardSalesQtyRef = Vue.ref(null);
        const cardDeliveryOrderQtyRef = Vue.ref(null);

        const salesOrderGridRef = Vue.ref(null);
        const inventoryTransactionGridRef = Vue.ref(null);
        const customerGroupChartRef = Vue.ref(null);
        const customerCategoryChartRef = Vue.ref(null);
        const stockChartRef = Vue.ref(null);

        const services = {
            getCardsData: async () => {
                try {
                    const response = await AxiosManager.get('/Dashboard/GetCardsDashboard', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getSalesData: async () => {
                try {
                    const response = await AxiosManager.get('/Dashboard/GetSalesDashboard', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getInventoryData: async () => {
                try {
                    const response = await AxiosManager.get('/Dashboard/GetInventoryDashboard', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
        };

        const methods = {
            populateCardsData: async () => {
                const response = await services.getCardsData();
                state.cardsData = response?.data?.content?.data;
                methods.populateCards();
            },
            populateSalesData: async () => {
                const response = await services.getSalesData();
                state.salesData = response?.data?.content?.data;
                methods.populateSalesOrderGrid();
                methods.populateSalesByCustomerGroupChart();
                methods.populateSalesByCustomerCategoryChart();
            },
            populateInventoryData: async () => {
                const response = await services.getInventoryData();
                state.inventoryData = response?.data?.content?.data;
                methods.populateInventoryTransactionGrid();
                methods.populateInventoryStockChart();
            },
            populateCards: () => {
                const cardsDashboard = state.cardsData?.cardsDashboard;

                if (cardsDashboard) {
                    cardSalesQtyRef.value.textContent = cardsDashboard.salesTotal || 0;
                    cardDeliveryOrderQtyRef.value.textContent = cardsDashboard.deliveryOrderTotal || 0;
                } else {
                    console.error('CardsDashboard data is not available.');
                }
            },
            populateSalesOrderGrid: () => {
                const salesOrderDashboard = state.salesData?.salesOrderDashboard ?? [];
                new ej.grids.Grid({
                    dataSource: salesOrderDashboard,
                    allowFiltering: false,
                    allowSorting: true,
                    allowSelection: false,
                    allowGrouping: false,
                    allowTextWrap: false,
                    allowResizing: false,
                    allowPaging: true,
                    allowExcelExport: false,
                    sortSettings: { columns: [{ field: 'orderDate', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 10 },
                    autoFit: false,
                    showColumnMenu: false,
                    gridLines: 'Horizontal',
                    columns: [
                        {
                            field: 'id', isPrimaryKey: true, headerText: 'Id', visible: false
                        },
                        { field: 'salesOrder.orderDate', headerText: 'Ngày đặt hàng', width: 100, type: 'dateTime', format: 'yyyy-MM-dd', textAlign: 'Left' },
                        { field: 'salesOrder.number', headerText: 'Mã đơn hàng', width: 110 },
                        { field: 'product.name', headerText: 'Thiết bị di động', width: 150 },
                        { field: 'total', headerText: 'Tổng cộng', width: 90, type: 'number', format: 'N2', textAlign: 'Right' },
                    ],
                }, salesOrderGridRef.value);
            },
            populateInventoryTransactionGrid: () => {
                const inventoryTransactionDashboard = state.inventoryData?.inventoryTransactionDashboard ?? [];
                new ej.grids.Grid({
                    dataSource: inventoryTransactionDashboard,
                    allowFiltering: false,
                    allowSorting: true,
                    allowSelection: false,
                    allowGrouping: false,
                    allowTextWrap: false,
                    allowResizing: false,
                    allowPaging: true,
                    allowExcelExport: false,
                    sortSettings: { columns: [{ field: 'movementDate', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 10 },
                    autoFit: false,
                    showColumnMenu: false,
                    gridLines: 'Horizontal',
                    columns: [
                        {
                            field: 'id', isPrimaryKey: true, headerText: 'Id', visible: false
                        },
                        { field: 'movementDate', headerText: 'Ngày giao dịch', width: 120, format: 'yyyy-MM-dd', textAlign: 'Left', type: 'dateTime' },
                        { field: 'warehouse.name', headerText: 'Kho', width: 120 },
                        { field: 'product.name', headerText: 'Thiết bị di động', width: 140 },
                        { field: 'stock', headerText: 'Số lượng biến động', width: 120, type: 'number', format: '+0.00;-0.00;0.00', textAlign: 'Right' },
                        { field: 'moduleName', headerText: 'Tên chức năng', width: 120 },
                        { field: 'moduleCode', headerText: 'Mã chứng từ', width: 120 },
                        { field: 'moduleNumber', headerText: 'Số chứng từ', width: 120 },
                        { field: 'warehouseFrom.name', headerText: 'Kho nguồn', width: 120 },
                        { field: 'warehouseTo.name', headerText: 'Kho nhận', width: 120 },
                    ],
                }, inventoryTransactionGridRef.value);
            },
            populateSalesByCustomerGroupChart: () => {
                const salesByCustomerGroupDashboard = state.salesData?.salesByCustomerGroupDashboard ?? [];
                new ej.charts.Chart(
                    {
                        primaryXAxis: {
                            valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 }, labelIntersectAction: 'None', labelRotation: ej.base.Browser.isDevice ? -45 : 0, minorTickLines: { width: 0 }
                        },
                        chartArea: { border: { width: 0 } },
                        primaryYAxis: {
                            title: 'Số lượng',
                            majorTickLines: { width: 0 }, lineStyle: { width: 0 },
                        },
                        series: salesByCustomerGroupDashboard,
                        title: 'Doanh số theo nhóm khách hàng',
                        tooltip: { enable: true, header: "<b>${point.tooltip}</b>", shared: true },
                        legendSettings: { enableHighlight: true },
                        palettes: ["#E94649", "#F6B53F", "#009CFF", "#C4C24A"],
                    },
                    customerGroupChartRef.value);
            },
            populateSalesByCustomerCategoryChart: () => {
                const salesByCustomerCategoryDashboard = state.salesData?.salesByCustomerCategoryDashboard ?? [];
                new ej.charts.Chart(
                    {
                        primaryXAxis: {
                            valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 }, labelIntersectAction: 'None', labelRotation: ej.base.Browser.isDevice ? -45 : 0, minorTickLines: { width: 0 }
                        },
                        chartArea: { border: { width: 0 } },
                        primaryYAxis: {
                            title: 'Số lượng',
                            majorTickLines: { width: 0 }, lineStyle: { width: 0 },
                        },
                        series: salesByCustomerCategoryDashboard,
                        title: 'Doanh số theo phân loại khách hàng',
                        tooltip: { enable: true, header: "<b>${point.tooltip}</b>", shared: true },
                        legendSettings: { enableHighlight: true },
                        palettes: ["#E94649", "#F6B53F", "#009CFF", "#C4C24A"],
                    },
                    customerCategoryChartRef.value);
            },
            populateInventoryStockChart: () => {
                const inventoryStockDashboard = state.inventoryData?.inventoryStockDashboard ?? [];
                new ej.charts.Chart(
                    {
                        primaryXAxis: {
                            valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 }, labelIntersectAction: 'None', labelRotation: -15, minorTickLines: { width: 0 }
                        },
                        chartArea: { border: { width: 0 } },
                        primaryYAxis: {
                            title: 'Số lượng',
                            majorTickLines: { width: 0 }, lineStyle: { width: 0 },
                        },
                        series: inventoryStockDashboard,
                        title: 'Tồn kho thiết bị theo từng kho hàng',
                        tooltip: { enable: true, header: "<b>${point.tooltip}</b>", shared: true },
                        legendSettings: { visible: true },
                        palettes: ["#E94649", "#F6B53F", "#009CFF", "#C4C24A"],
                    },
                    stockChartRef.value);
            },
        };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['Dashboards']);
                await SecurityManager.validateToken();

                await methods.populateCardsData();
                await methods.populateSalesData();
                await methods.populateInventoryData();

            } catch (e) {
                console.error('page init error:', e);
            }
        });

        return {
            cardSalesQtyRef,
            cardDeliveryOrderQtyRef,
            salesOrderGridRef,
            inventoryTransactionGridRef,
            customerGroupChartRef,
            customerCategoryChartRef,
            stockChartRef,
            state,
            methods
        };
    }
};

Vue.createApp(App).mount('#app');