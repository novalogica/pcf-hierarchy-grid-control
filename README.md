## Hierarchy Indicator Control

| ![Hierarchy Indicator](https://github.com/novalogica/pcf-hierarchy-control/blob/main/screenshots/pa-hierarchy-grid-control.png?raw=true) |
|:--:|
| *Figure 2: Hierarchy Indicator control displaying hierarchy indicator for all account records.* |

If you want to maintain the legacy feature of checking if a record has a hierarchy, providing a seamless transition for users, you can add this bundled control to the entity views.

- **Hierarchy Indicator**: Displays an icon embedded at the start of the primary attribute value in the view to indicate the presence of a hierarchy.
- **Seamless Integration**: Clicking this icon opens the main Hierarchy PCF control, ensuring a smooth user experience.

### How to Add Control to Entity View?
1. Open the desired view in Dynamics 365.
2. Add a component by selecting **PowerApps Grid Control**.
3. Choose the **Customizer Control** and select **nl_novalogica.PAHierarchyGrid**.

| ![Hierarchy Indicator](https://github.com/novalogica/pcf-hierarchy-control/blob/main/screenshots/pa-hierarchy-grid-control.png?raw=true) |
|:--:|
| *Figure 3: Hierarchy indicator control configuration* |

---

## 🚀 Configuration

### **Step-by-Step Setup**
1. **Download the Solution**: Download the bundled solution file containing both the Hierarchy and Hierarchy Indicator PCF controls.
2. **Import the Solution**: Import the solution into your Dynamics 365 environment.
3. **Add the Hierarchy Control**: Add the Hierarchy PCF control to the desired form or view.
4. **Add the Hierarchy Indicator Control**: Add the PowerApps Component customizer to the view to enable the hierarchy indicator feature.