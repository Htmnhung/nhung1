using Application.Common.Services.SecurityManager;
using System.Text.Json;

namespace Infrastructure.SecurityManager.NavigationMenu;

public class JsonStructureItem
{
    public string? URL { get; set; }
    public string? Name { get; set; }
    public bool IsModule { get; set; }
    public List<JsonStructureItem> Children { get; set; } = new List<JsonStructureItem>();
}

public static class NavigationTreeStructure
{
    public static readonly string JsonStructure = """
    [
        {
            "URL": "#",
            "Name": "Trang chủ",
            "IsModule": true,
            "Children": [
                {
                    "URL": "/Dashboards/DefaultDashboard",
                    "Name": "Bảng điều khiển",
                    "IsModule": false
                }
            ]
        },
        {
            "URL": "#",
            "Name": "Bán hàng",
            "IsModule": true,
            "Children": [
                {
                    "URL": "/CustomerGroups/CustomerGroupList",
                    "Name": "Nhóm khách hàng",
                    "IsModule": false
                },
                {
                    "URL": "/CustomerCategories/CustomerCategoryList",
                    "Name": "Loại khách hàng",
                    "IsModule": false
                },
                {
                    "URL": "/Customers/CustomerList",
                    "Name": "Khách hàng",
                    "IsModule": false
                },
                {
                    "URL": "/CustomerContacts/CustomerContactList",
                    "Name": "Liên hệ khách hàng",
                    "IsModule": false
                },
                {
                    "URL": "/SalesOrders/SalesOrderList",
                    "Name": "Đơn bán hàng",
                    "IsModule": false
                },
                {
                    "URL": "/SalesReturns/SalesReturnList",
                    "Name": "Trả hàng bán",
                    "IsModule": false
                },
                {
                    "URL": "/SalesReports/SalesReportList",
                    "Name": "Báo cáo bán hàng",
                    "IsModule": false
                }
            ]
        },
        {
            "URL": "#",
            "Name": "Mua hàng",
            "IsModule": true,
            "Children": [
                {
                    "URL": "/VendorGroups/VendorGroupList",
                    "Name": "Nhóm nhà cung cấp",
                    "IsModule": false
                },
                {
                    "URL": "/VendorCategories/VendorCategoryList",
                    "Name": "Loại nhà cung cấp",
                    "IsModule": false
                },
                {
                    "URL": "/Vendors/VendorList",
                    "Name": "Nhà cung cấp",
                    "IsModule": false
                },
                {
                    "URL": "/VendorContacts/VendorContactList",
                    "Name": "Liên hệ nhà cung cấp",
                    "IsModule": false
                },
                {
                    "URL": "/PurchaseOrders/PurchaseOrderList",
                    "Name": "Đơn nhập hàng",
                    "IsModule": false
                },
                {
                    "URL": "/GoodsReceives/GoodsReceiveList",
                    "Name": "Phiếu nhập kho",
                    "IsModule": false
                },
                {
                    "URL": "/PurchaseReturns/PurchaseReturnList",
                    "Name": "Trả hàng mua",
                    "IsModule": false
                },
                {
                    "URL": "/PurchaseReports/PurchaseReportList",
                    "Name": "Báo cáo mua hàng",
                    "IsModule": false
                }
            ]
        },
        {
            "URL": "#",
            "Name": "Sản phẩm & Kho",
            "IsModule": true,
            "Children": [
                {
                    "URL": "/UnitMeasures/UnitMeasureList",
                    "Name": "Đơn vị tính",
                    "IsModule": false
                },
                {
                    "URL": "/ProductGroups/ProductGroupList",
                    "Name": "Hãng điện thoại",
                    "IsModule": false
                },
                {
                    "URL": "/Products/ProductList",
                    "Name": "Điện thoại",
                    "IsModule": false
                },
                {
                    "URL": "/Warehouses/WarehouseList",
                    "Name": "Kho",
                    "IsModule": false
                },
                {
                    "URL": "/DeliveryOrders/DeliveryOrderList",
                    "Name": "Phiếu xuất kho",
                    "IsModule": false
                },
                {
                    "URL": "/TransferOuts/TransferOutList",
                    "Name": "Chuyển kho đi",
                    "IsModule": false
                },
                {
                    "URL": "/TransferIns/TransferInList",
                    "Name": "Chuyển kho đến",
                    "IsModule": false
                },
                {
                    "URL": "/PositiveAdjustments/PositiveAdjustmentList",
                    "Name": "Điều chỉnh tăng",
                    "IsModule": false
                },
                {
                    "URL": "/NegativeAdjustments/NegativeAdjustmentList",
                    "Name": "Điều chỉnh giảm",
                    "IsModule": false
                },
                {
                    "URL": "/Scrappings/ScrappingList",
                    "Name": "Hủy hàng",
                    "IsModule": false
                },
                {
                    "URL": "/StockCounts/StockCountList",
                    "Name": "Kiểm kê",
                    "IsModule": false
                },
                {
                    "URL": "/TransactionReports/TransactionReportList",
                    "Name": "Báo cáo giao dịch",
                    "IsModule": false
                },
                {
                    "URL": "/MovementReports/MovementReportList",
                    "Name": "Báo cáo biến động",
                    "IsModule": false
                },
                {
                    "URL": "/StockReports/StockReportList",
                    "Name": "Báo cáo tồn kho",
                    "IsModule": false
                }
            ]
        },
        {
            "URL": "#",
            "Name": "Tài khoản",
            "IsModule": true,
            "Children": [
                {
                    "URL": "/Users/UserList",
                    "Name": "Người dùng",
                    "IsModule": false
                },
                {
                    "URL": "/Roles/RoleList",
                    "Name": "Vai trò",
                    "IsModule": false
                }
            ]
        },
        {
            "URL": "#",
            "Name": "Hồ sơ",
            "IsModule": true,
            "Children": [
                {
                    "URL": "/Profiles/MyProfile",
                    "Name": "Thông tin cá nhân",
                    "IsModule": false
                }
            ]
        },
        {
            "URL": "#",
            "Name": "Cài đặt",
            "IsModule": true,
            "Children": [
                {
                    "URL": "/Companies/MyCompany",
                    "Name": "Thông tin cửa hàng",
                    "IsModule": false
                },
                {
                    "URL": "/Taxs/TaxList",
                    "Name": "Thuế",
                    "IsModule": false
                },
                {
                    "URL": "/NumberSequences/NumberSequenceList",
                    "Name": "Mã tự động",
                    "IsModule": false
                }
            ]
        }
    ]
    """;

    public static List<MenuNavigationTreeNodeDto> GetCompleteMenuNavigationTreeNode()
    {
        var json = JsonStructure;
        var menus = JsonSerializer.Deserialize<List<JsonStructureItem>>(json);

        List<MenuNavigationTreeNodeDto> nodes = new List<MenuNavigationTreeNodeDto>();

        var index = 1;
        void AddNodes(List<JsonStructureItem> menuItems, string? parentId = null)
        {
            foreach (var item in menuItems)
            {
                var nodeId = index.ToString();
                if (item.IsModule)
                {
                    nodes.Add(new MenuNavigationTreeNodeDto(nodeId, item.Name ?? "", param_hasChild: true, param_expanded: false));
                }
                else
                {
                    nodes.Add(new MenuNavigationTreeNodeDto(nodeId, item.Name ?? "", parentId, item.URL));
                }

                index++;

                if (item.Children != null && item.Children.Count > 0)
                {
                    AddNodes(item.Children, nodeId);
                }
            }
        }

        if (menus != null) AddNodes(menus);

        return nodes;
    }

    public static string GetFirstSegmentFromUrlPath(string? path)
    {
        var result = string.Empty;
        if (path != null && path.Contains("/"))
        {
            string[] parts = path.Split("/");
            if (parts.Length > 2)
            {
                result = parts[1];
            }
        }
        return result;
    }

    public static List<string> GetCompleteFirstMenuNavigationSegment()
    {
        var json = JsonStructure;
        var menus = JsonSerializer.Deserialize<List<JsonStructureItem>>(json);
        var result = new List<string>();

        if (menus != null)
        {
            foreach (var item in menus)
            {
                ProcessMenuItem(item, result);
            }
        }

        return result;
    }

    private static void ProcessMenuItem(JsonStructureItem item, List<string> result)
    {
        if (!string.IsNullOrEmpty(item.URL) && item.URL != "#")
        {
            var segment = GetFirstSegmentFromUrlPath(item.URL);
            if (!string.IsNullOrEmpty(segment) && !result.Contains(segment))
            {
                result.Add(segment);
            }
        }

        if (item.Children != null)
        {
            foreach (var child in item.Children)
            {
                ProcessMenuItem(child, result);
            }
        }
    }
}