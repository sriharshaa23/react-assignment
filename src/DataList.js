import React, { useState, useEffect } from "react";
import users from "./users.json";

function DataList() {
  const [userList] = useState(users);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    age: true,
    workExperience: true,
  });
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [idRange, setIdRange] = useState({ min: "", max: "" });
  const [ageRange, setAgeRange] = useState({ min: "", max: "" });
  const [workExperienceRange, setWorkExperienceRange] = useState({ min: "", max: "" });
  const [isAgeFilterOpen, setIsAgeFilterOpen] = useState(false);
  const [isExperienceFilterOpen, setIsExperienceFilterOpen] = useState(false);
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const handleSort = (field) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.field === field) {
        return { ...prevConfig, order: prevConfig.order === "asc" ? "desc" : "asc" };
      }
      return { field, order: "asc" };
    });
  };

  const getSortIcon = (field) => {
    if (!sortConfig || sortConfig.field !== field) return "⇅";
    return sortConfig.order === "asc" ? "▲" : "▼";
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleColumnVisibilityChange = (e) => {
    const column = e.target.name;
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: e.target.checked,
    }));
  };

  const handleRangeChange = (event, rangeType) => {
    const { name, value } = event.target;
    if (rangeType === "id") {
      setIdRange((prev) => ({ ...prev, [name]: value }));
    } else if (rangeType === "age") {
      setAgeRange((prev) => ({ ...prev, [name]: value }));
    } else if (rangeType === "workExperience") {
      setWorkExperienceRange((prev) => ({ ...prev, [name]: value }));
    }
    setCurrentPage(1);
  };

  const filteredUsers = userList
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery) ||
        user.age.toString().includes(searchQuery) ||
        user.workExperience.toString().includes(searchQuery);

      const inIdRange =
        (!idRange.min || user.id >= parseInt(idRange.min)) &&
        (!idRange.max || user.id <= parseInt(idRange.max));

      const inAgeRange =
        (!ageRange.min || user.age >= parseInt(ageRange.min)) &&
        (!ageRange.max || user.age <= parseInt(ageRange.max));

      const inWorkExperienceRange =
        (!workExperienceRange.min || user.workExperience >= parseInt(workExperienceRange.min)) &&
        (!workExperienceRange.max || user.workExperience <= parseInt(workExperienceRange.max));

      return matchesSearch && inIdRange && inAgeRange && inWorkExperienceRange;
    });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const sortedUsers = [...currentUsers].sort((a, b) => {
    if (!sortConfig) return 0;
    const { field, order } = sortConfig;
    if (a[field] < b[field]) return order === "asc" ? -1 : 1;
    if (a[field] > b[field]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        if (currentPage < totalPages) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, totalPages]);

  return (
    <div className="data-list">
      <h1>Users List</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, age, or work experience"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="filters">
        <div className="all-filters">
          <div className="column-toggle">
            <button onClick={() => setIsAgeFilterOpen(!isAgeFilterOpen)}>
              Modify Age
            </button>
            {isAgeFilterOpen && (
              <div className="range-filter">
                <input
                  type="number"
                  name="min"
                  placeholder="Min Age"
                  value={ageRange.min}
                  onChange={(e) => handleRangeChange(e, "age")}
                />
                <span>-</span>
                <input
                  type="number"
                  name="max"
                  placeholder="Max Age"
                  value={ageRange.max}
                  onChange={(e) => handleRangeChange(e, "age")}
                />
              </div>
            )}
          </div>

          <div className="column-toggle">
            <button onClick={() => setIsExperienceFilterOpen(!isExperienceFilterOpen)}>
              Modify Work Experience
            </button>
            {isExperienceFilterOpen && (
              <div className="range-filter">
                <input
                  type="number"
                  name="min"
                  placeholder="Min Experience"
                  value={workExperienceRange.min}
                  onChange={(e) => handleRangeChange(e, "workExperience")}
                />
                <span>-</span>
                <input
                  type="number"
                  name="max"
                  placeholder="Max Experience"
                  value={workExperienceRange.max}
                  onChange={(e) => handleRangeChange(e, "workExperience")}
                />
              </div>
            )}
          </div>

          <div className="column-toggle">
            <button onClick={() => setIsToggleOpen(!isToggleOpen)}>
              Column Visibility
            </button>
            {isToggleOpen && (
              <div className="column-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    name="name"
                    checked={visibleColumns.name}
                    onChange={handleColumnVisibilityChange}
                  />
                  Name
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="age"
                    checked={visibleColumns.age}
                    onChange={handleColumnVisibilityChange}
                  />
                  Age
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="workExperience"
                    checked={visibleColumns.workExperience}
                    onChange={handleColumnVisibilityChange}
                  />
                  Work Experience
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {visibleColumns.id && (
                <th onClick={() => handleSort("id")}>
                  ID {getSortIcon("id")}
                </th>
              )}
              {visibleColumns.name && (
                <th onClick={() => handleSort("name")}>
                  Name {getSortIcon("name")}
                </th>
              )}
              {visibleColumns.age && (
                <th onClick={() => handleSort("age")}>
                  Age {getSortIcon("age")}
                </th>
              )}
              {visibleColumns.workExperience && (
                <th onClick={() => handleSort("workExperience")}>
                  Work Experience {getSortIcon("workExperience")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user) => (
                <tr key={user.id}>
                  {visibleColumns.id && <td>{user.id}</td>}
                  {visibleColumns.name && <td>{user.name}</td>}
                  {visibleColumns.age && <td>{user.age}</td>}
                  {visibleColumns.workExperience && <td>{user.workExperience}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Object.values(visibleColumns).filter(Boolean).length} style={{ textAlign: "center" }}>
                  No matching data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataList;
