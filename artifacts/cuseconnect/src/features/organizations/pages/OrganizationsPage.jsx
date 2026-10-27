import { useEffect, useState } from 'react';
import { getClubs } from '../data/getClubs.js';
import OrgCard from '../components/OrgCard.jsx';
import styles from './OrganizationsPage.module.css';

export default function OrganizationsPage() {
  const [clubs, setClubs] = useState(null);
  const [failed, setFailed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    let active = true;

    getClubs()
      .then((data) => active && setClubs(data))
      .catch(() => active && setFailed(true));

    return () => {
      active = false;
    };
  }, []);

  // Filter clubs by name AND category
  const filteredClubs = (clubs ?? []).filter((club) => {
    const matchesSearch = club.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      club.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Reset search and category filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Explore Clubs</h1>

      {/* Search and Filter Controls */}
<div className={styles.filters}>

  {/* Search Bar */}
  <input
    type="search"
    className={styles.searchInput}
    placeholder="Search clubs by name..."
    aria-label="Search clubs by name"
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />

  {/* Category Dropdown */}
  <select
    id="category-filter"
    className={styles.categorySelect}
    aria-label="Filter clubs by category"
    value={selectedCategory}
    onChange={(event) => setSelectedCategory(event.target.value)}
  >
    <option value="all">All Categories</option>
    <option value="tech">Technology</option>
    <option value="media">Media</option>
    <option value="outdoors">Outdoors</option>
    <option value="service">Community Service</option>
    <option value="business">Business</option>
    <option value="culture">Culture</option>
    <option value="arts">Arts</option>
    <option value="sports">Sports</option>
  </select>

  {/* Clear Filters Button */}
  <button
    type="button"
    className={styles.clearButton}
    onClick={clearFilters}
  >
    Clear Filters
  </button>

</div>

      {/* Display Clubs */}
      {failed ? (
        <p className={styles.message} role="alert">
          We couldn't load clubs right now. Try refreshing the page.
        </p>
      ) : !clubs ? (
        <p className={styles.message} role="status">
          Loading clubs…
        </p>
      ) : filteredClubs.length === 0 ? (
        <p className={styles.message} role="status">
          No clubs found. Try a different search or category.
        </p>
      ) : (
        <ul className={styles.grid}>
          {filteredClubs.map((club) => (
            <li key={club.id}>
              <OrgCard
                name={club.name}
                description={club.description}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}