import { useState, useEffect } from "react";
import Creatable from "react-select/creatable";
import { useMaterialsContext } from "../../hooks/useMaterialsContext";
import styles from "./AllTagsSelect.module.css";
import DOMPurify from "../../utils/dompurifyConfig";
import debug from "debug";

function AllTagsSelect({ onTagsChange, id }) {
  const { materials } = useMaterialsContext();
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const log = debug("AllTagsSelect:error");

  useEffect(() => {
    try {
      const rawTags = localStorage.getItem("allTags");
      const savedAllTags = rawTags ? JSON.parse(rawTags) : [];

      if (Array.isArray(savedAllTags) && savedAllTags.length > 0) {
        const sanitizedTags = savedAllTags.map((tag) =>
          DOMPurify.sanitize(tag)
        );
        setAllTags(sanitizedTags);
      } else if (Array.isArray(materials) && materials.length > 0) {
        const tagsSet = new Set(
          materials.flatMap((material) =>
            material.tags.map((tag) => DOMPurify.sanitize(tag))
          )
        );
        const tagsArray = Array.from(tagsSet);
        setAllTags(tagsArray);
        localStorage.setItem("allTags", JSON.stringify(tagsArray));
      } else {
        savedAllTags.push("Draft");
        setAllTags(savedAllTags);
        localStorage.setItem("allTags", JSON.stringify(savedAllTags));
      }
    } catch (error) {
      log("Error loading tags:", error);
      setAllTags((prevTags) => (prevTags.length > 0 ? prevTags : []));
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  }, [materials]);

  useEffect(() => {
    try {
      const sanitizedTags = allTags.map((tag) => DOMPurify.sanitize(tag));
      localStorage.setItem("allTags", JSON.stringify(sanitizedTags));
      const storedTags = JSON.parse(localStorage.getItem("allTags"));
    } catch (error) {
      log("Error saving tags to localStorage:", error);
    }
  }, [allTags]);

  const handleChange = (selectedOptions) => {
    try {
      const options = selectedOptions
        ? Array.from(
            new Set(
              selectedOptions.map((option) =>
                DOMPurify.sanitize(option.value.trim())
              )
            )
          )
        : [];

      setSelectedTags(options);

      onTagsChange(options);

      setAllTags((prevTags) => Array.from(new Set([...prevTags, ...options])));

      setUserInteracted(true);
    } catch (error) {
      log("Error handling tag change:", error);
    }
  };

  const isValidNewOption = (inputValue) => {
    const sanitizedInput = DOMPurify.sanitize(inputValue.trim());
    return (
      sanitizedInput.length > 0 &&
      sanitizedInput.length <= 16 &&
      !allTags.includes(sanitizedInput)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dataLoaded) {
    return (
      <div className="error">
        An error occurred: please try refreshing the page. If this problem
        persists, please contact support.
      </div>
    );
  }

  const customCreatableStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      cursor: "pointer",
      width: "100%",
      maxWidth: "100%",
      marginTop: "1rem",
      marginLeft: "auto",
      marginRight: "auto",
      border: state.isFocused ? "1px solid #667B99" : "1px solid #e6e6e6",
      boxShadow: state.isFocused ? "0 0 0 1px #667B99" : baseStyles.boxShadow,
      "&:hover": {
        border: state.isFocused ? "1px solid #667B99" : "1px solid #e6e6e6",
      },
    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      padding: "0.5rem",
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      color: "var(--secondary)",
      fontSize: "1rem",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      maxWidth: "100%",
      padding: "1rem 0.5rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      backgroundColor: state.isFocused
        ? "var(--secondary-light)"
        : baseStyles.backgroundColor,
      color: state.isFocused ? "white" : baseStyles.color,
      ":hover": {
        backgroundColor: "var(--secondary-light)",
      },
    }),
    multiValue: (baseStyles, state) => {
      return {
        ...baseStyles,
        backgroundColor: "var(--secondary-chips)",
        color: "white",
        maxWidth: "100%",
        whiteSpace: "nowrap",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 0.2rem",
        overflow: "hidden",
      };
    },
    multiValueLabel: (baseStyles, state) => {
      return {
        ...baseStyles,
        color: "#fffffff",
        fontSize: "1rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      };
    },
    multiValueRemove: (baseStyles, state) => {
      return {
        ...baseStyles,
        color: "#fffffff",
        fontSize: "1rem",
        padding: "0.9rem",
      };
    },
    valueContainer: (baseStyles, state) => {
      return {
        ...baseStyles,
        maxWidth: "100%",
        maxHeight: "7.375rem",
        overflowY: "auto",
        boxSizing: "border-box",
      };
    },
    dropdownIndicator: (baseStyles, state) => {
      return {
        ...baseStyles,
        color: "var(--secondary)",
        padding: "0.9rem",
      };
    },
    clearIndicator: (baseStyles, state) => {
      return {
        ...baseStyles,
        color: "var(--secondary)",
        padding: "0.9rem",
      };
    },
  };

  return (
    <div className={styles.tagSectionLabel}>
      Select or create tags:
      <div className={styles.selectContainer}>
        {allTags.length > 0 ? (
          <Creatable
            inputId={id}
            className={styles.creatableSelect}
            isMulti
            options={allTags.map((tag) => ({
              value: tag,
              label: tag,
            }))}
            value={selectedTags.map((tag) => ({
              value: tag,
              label: tag,
            }))}
            onChange={handleChange}
            isValidNewOption={isValidNewOption}
            styles={customCreatableStyles}
            menuPlacement="top"
          />
        ) : (
          <div>No tags available</div>
        )}
      </div>
    </div>
  );
}

export default AllTagsSelect;
