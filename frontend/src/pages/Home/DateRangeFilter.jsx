import { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { isWithinInterval } from "date-fns";
import styles from "./DateRangeFilter.module.css";
import DOMPurify from "../../utils/dompurifyConfig";

/**
 * Filter rows by the selected date range.
 *
 * @param {Array} rows - The rows of the table.
 * @param {string} columnId - The ID of the column to filter.
 * @param {Object} filterValue - The selected date range with `startDate` and `endDate`.
 * @returns {Array} Filtered rows that fall within the selected date range.
 */

export const filterByDateRange = (rows, columnId, filterValue) => {
  if (filterValue && filterValue.startDate && filterValue.endDate) {
    return rows.filter((row) =>
      isWithinInterval(new Date(row.values[columnId]), {
        start: filterValue.startDate,
        end: filterValue.endDate,
      })
    );
  }
  return rows;
};

/**
 * DateRangeFilter component for filtering table rows by a date range.
 *
 * @param {Function} handleFilter - Callback function to apply the filter to the table.
 * @param {Array} preGlobalFilteredRows - Array of all table rows before filtering.
 * @returns {JSX.Element} The rendered DateRangeFilter component.
 */

function DateRangeFilter({ handleFilter, preGlobalFilteredRows }) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  /* Hide and disable mouse and keyboard interaction redundant elements */
  useEffect(() => {
    const hideTodayButton = () => {
      const todayButton = document.querySelector(
        ".rdrStaticRange .rdrStaticRangeLabel"
      );
      if (todayButton && todayButton.textContent.trim() === "Today") {
        todayButton.style.display = "none";
        todayButton.setAttribute("tabindex", "-1");
        return true;
      }
      return false;
    };

    if (hideTodayButton()) {
      return;
    }
    // Fallback for misc. DOM changes
    const observer = new MutationObserver(() => {
      if (hideTodayButton()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const modifyInputRangeElements = () => {
      const inputRangeElements = document.querySelectorAll(".rdrInputRange");
      inputRangeElements.forEach((element) => {
        element.style.visibility = "hidden";
        element.style.pointerEvents = "none";
        element.setAttribute("tabindex", "-1");
      });
    };

    modifyInputRangeElements();

    // Fallback for misc. DOM changes
    const observer = new MutationObserver(() => {
      modifyInputRangeElements();
      const inputRangeElements = document.querySelectorAll(".rdrInputRange");
      // Target exact elements
      if (inputRangeElements.length >= 2) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // State for aria-live messages
  const [liveMessage, setLiveMessage] = useState("");

  /**
   * Handles date range selection and filters the table rows.
   *
   * @param {Object} ranges - The selected date ranges.
   * @property {Object} selection - Contains `startDate` and `endDate` of the selected range.
   */
  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    const rawStartDate = startDate.toDateString();
    const rawEndDate = endDate.toDateString();

    const sanitizedStartDate = DOMPurify.sanitize(startDate.toDateString());
    const sanitizedEndDate = DOMPurify.sanitize(endDate.toDateString());

    setDateRange({
      startDate: new Date(sanitizedStartDate),
      endDate: new Date(sanitizedEndDate),
      key: "selection",
    });

    handleFilter({
      startDate: new Date(sanitizedStartDate),
      endDate: new Date(sanitizedEndDate),
    });

    const filteredRowCount = preGlobalFilteredRows.filter((row) => {
      const createdDate = row.values.createdAt
        ? new Date(row.values.createdAt)
        : null;
      const updatedDate = row.values.updatedAt
        ? new Date(row.values.updatedAt)
        : null;

      return (
        (createdDate &&
          !Number.isNaN(createdDate) &&
          createdDate >= startDate &&
          createdDate <= endDate) ||
        (updatedDate &&
          !Number.isNaN(updatedDate) &&
          updatedDate >= startDate &&
          updatedDate <= endDate)
      );
    }).length;

    setLiveMessage("Table filtered by selected dates");
  };

  /* rangeColors prop sets color scheme of 
     DateRangePicker: 'primary' color */
  const rangeColors = ["#667B99"];

  const ariaLabels = {
    dateInput: {
      startDate: "Start Date Picker",
      endDate: "End Date Picker",
    },
    monthPicker: "Select a month",
    yearPicker: "Select a year",
    prevButton: "Go to the previous month",
    nextButton: "Go to the next month",
  };

  /**
   * Workaround for lack aria-labels
   * previous & next month horizontal chevron buttons
   */
  useEffect(() => {
    const updateAriaLabels = () => {
      const prevButtons = document.querySelectorAll(".rdrPprevButton");
      const nextButtons = document.querySelectorAll(".rdrNextButton");

      prevButtons.forEach((button) => {
        button.setAttribute("aria-label", "Previous Month");
      });

      nextButtons.forEach((button) => {});
    };

    /**
     * Adds visual focus indicator for navigation buttons and dropdowns.
     *
     * @param {FocusEvent} e - The focus event.
     */
    const handleFocusIn = (e) => {
      if (e.target.classList.contains("rdrNextPrevButton")) {
        e.target.style.outline = "2px solid black";
      }

      if (
        e.target.tagName === "SELECT" &&
        (e.target.parentNode.classList.contains("rdrMonthPicker") ||
          e.target.parentNode.classList.contains("rdrYearPicker"))
      ) {
        e.target.style.outline = "2px solid black";
      }
    };
    /**
     * Removes visual focus indicator when focus is lost.
     *
     * @param {FocusEvent} e - The blur event.
     */
    const handleFocusOut = (e) => {
      if (e.target.classList.contains("rdrNextPrevButton")) {
        e.target.style.outline = "";
      }

      if (
        e.target.tagName === "SELECT" &&
        (e.target.parentNode.classList.contains("rdrMonthPicker") ||
          e.target.parentNode.classList.contains("rdrYearPicker"))
      ) {
        e.target.style.outline = "";
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    updateAriaLabels();

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <>
      <div className={styles.modal}>
        <div aria-live="polite" className="aria-live-hidden">
          {liveMessage}
        </div>
        <DateRangePicker
          className={styles.modal}
          rangeColors={rangeColors}
          showSelectionPreview={false}
          ranges={[dateRange]}
          onChange={handleSelect}
          ariaLabels={ariaLabels}
          startDatePlaceholder="start date"
          endDatePlaceholder="end date"
          editableDateInputs
          dateDisplayFormat="dd-MM-yyyy"
        />
      </div>
    </>
  );
}

export default DateRangeFilter;
