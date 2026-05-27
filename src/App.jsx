import React, { useEffect, useMemo, useState } from "react";
import logo from "../assets/images/logo.png";
import oldImg from "../assets/images/old.jpg";
import famImg from "../assets/images/fam.jpg";
import peaceImg from "../assets/images/peace.jpg";
import criticalThinkingImg from "../assets/images/critical_thinking.jpeg";
import empathyImg from "../assets/images/empathy.jpg";
import vocabularyImg from "../assets/images/vocabulary.jpg";
import book1Img from "../assets/images/book1.jpg";
import book2Img from "../assets/images/book2.jpg";
import book3Img from "../assets/images/book3.jpg";
import book4Img from "../assets/images/book4.jpg";
import book5Img from "../assets/images/book5.jpg";
import book6Img from "../assets/images/book6.jpg";
import book7Img from "../assets/images/book7.jpg";
import book8Img from "../assets/images/book8.jpg";
import book9Img from "../assets/images/book9.jpg";
import book10Img from "../assets/images/book10.jpg";

const STORAGE_CART_KEY = "cartItems";
const STORAGE_LIBRARY_KEY = "wantToReadItems";
const STORAGE_FORUM_KEY = "forumPosts";
const SEARCH_CACHE_KEY = "bookSearchCache";
const STORAGE_CHALLENGE_REVIEWS_KEY = "challengeReviews";
const STORAGE_BOOK_NOTES_KEY = "bookNotes";
const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY?.trim();

const educationCategories = [
  "math",
  "history",
  "chemistry",
  "biology",
  "physics",
  "computer science",
  "art",
  "music",
  "biography",
  "classics",
  "philosophy",
  "sports",
  "business",
  "poetry",
  "psychology",
  "self help",
  "travel",
];

const fictionCategories = [
  "adventure",
  "fantasy",
  "historical fiction",
  "romance",
  "horror",
  "mystery",
  "science fiction",
  "young adult",
];

const challengeBooks = [
  {
    title: "School for Good and Evil",
    words: 105365,
    image: book1Img,
    link: "https://www.google.co.id/books/edition/The_School_for_Good_and_Evil/Y8MTHn6j9W4C?hl=en&gbpv=0",
  },
  {
    title: "The Book Thief",
    words: 118933,
    image: book2Img,
    link: "https://www.google.co.id/books/edition/The_Book_Thief/veGXULZK6UAC?hl=en&gbpv=1&dq=the+book+thief&printsec=frontcover",
  },
  {
    title: "Crazy Rich Asians",
    words: 116311,
    image: book3Img,
    link: "https://www.google.co.id/books/edition/The_Seven_Husbands_of_Evelyn_Hugo/cPlBEAAAQBAJ?hl=en&gbpv=0",
  },
  {
    title: "Don Quixote",
    words: 345390,
    image: book4Img,
    link: "https://www.google.co.id/books/edition/Don_Quixote/BupDAAAAcAAJ?hl=en&gbpv=1&dq=don+quixote&printsec=frontcover",
  },
  {
    title: "Heartstopper",
    words: 86112,
    image: book5Img,
    link: "https://www.google.co.id/books/edition/Heartstopper/MvcUyAEACAAJ?hl=en",
  },
  {
    title: "Mockingbird",
    words: 36466,
    image: book6Img,
    link: "https://www.google.co.id/books/edition/Mockingbird/SzF8AwAAQBAJ?hl=en&gbpv=1&dq=mockingbird&printsec=frontcover",
  },
  {
    title: "A Study in Scarlet",
    words: 43167,
    image: book7Img,
    link: "https://www.google.co.id/books/edition/A_Study_in_Scarlet_Illustrated/M1P7zQEACAAJ?hl=en",
  },
  {
    title: "Yellowface",
    words: 21500,
    image: book8Img,
    link: "https://www.google.co.id/books/edition/Yellowface/crZ1EAAAQBAJ?hl=en&gbpv=1&dq=yellowface&printsec=frontcover",
  },
  {
    title: "The House of Silk",
    words: 94662,
    image: book9Img,
    link: "https://www.google.co.id/books/edition/The_House_of_Silk/rf02AQAAQBAJ?hl=en&gbpv=0",
  },
  {
    title: "They Both Die at the End",
    words: 116311,
    image: book10Img,
    link: "https://www.google.co.id/books/edition/They_Both_Die_at_the_End/5pSyDQAAQBAJ?hl=en&gbpv=1&dq=they+both+die+at+the+end&printsec=frontcover",
  },
];

const whyReadItems = [
  {
    title: "Protect cognitive function",
    text: "A Neurology study found regular book reading is associated with a slower rate of cognitive decline.",
    image: oldImg,
  },
  {
    title: "Support long-term wellbeing",
    text: "Research published in Social Science & Medicine observed lower mortality risk among consistent book readers.",
    image: famImg,
  },
  {
    title: "Reduce stress quickly",
    text: "University of Sussex research reported that six minutes of reading can significantly lower stress levels.",
    image: peaceImg,
  },
];

const skillItems = [
  {
    title: "Critical Thinking",
    text: "Build stronger analysis by comparing ideas, arguments, and evidence across different texts.",
    image: criticalThinkingImg,
  },
  {
    title: "Empathy",
    text: "Understand people better by experiencing diverse perspectives, emotions, and life stories.",
    image: empathyImg,
  },
  {
    title: "Vocabulary Growth",
    text: "Expand word choice and communication precision through repeated language exposure.",
    image: vocabularyImg,
  },
];

function loadList(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatRp(value) {
  if (value === null || value === undefined || value === "") return "Price not available";
  const num = Number(value);
  if (Number.isNaN(num)) return `Rp ${String(value)}`;
  return `Rp ${num.toLocaleString()}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [library, setLibrary] = useState([]);
  const [educationQuery, setEducationQuery] = useState("");
  const [educationCategory, setEducationCategory] = useState("");
  const [educationResults, setEducationResults] = useState([]);
  const [educationLoading, setEducationLoading] = useState(false);
  const [educationError, setEducationError] = useState("");
  const [educationSearched, setEducationSearched] = useState(false);
  const [fictionQuery, setFictionQuery] = useState("");
  const [fictionCategoriesSelected, setFictionCategoriesSelected] = useState([]);
  const [fictionResults, setFictionResults] = useState([]);
  const [fictionLoading, setFictionLoading] = useState(false);
  const [fictionError, setFictionError] = useState("");
  const [fictionSearched, setFictionSearched] = useState(false);
  const [forumPosts, setForumPosts] = useState([]);
  const [forumForm, setForumForm] = useState({
    name: "",
    email: "",
    question: "",
  });
  const [forumError, setForumError] = useState("");
  const [challengeReviews, setChallengeReviews] = useState({});
  const [activeReviewBook, setActiveReviewBook] = useState(null);
  const [reviewRating, setReviewRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [bookNotes, setBookNotes] = useState({});

  useEffect(() => {
    setCart(loadList(STORAGE_CART_KEY));
    setLibrary(loadList(STORAGE_LIBRARY_KEY));
    setForumPosts(loadList(STORAGE_FORUM_KEY));
    const loadedReviews = loadList(STORAGE_CHALLENGE_REVIEWS_KEY);
    if (loadedReviews && !Array.isArray(loadedReviews)) {
      setChallengeReviews(loadedReviews);
    }
    const loadedNotes = loadList(STORAGE_BOOK_NOTES_KEY);
    if (loadedNotes && !Array.isArray(loadedNotes)) {
      setBookNotes(loadedNotes);
    }
  }, []);

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [cart],
  );

  const challengeWordTotal = useMemo(
    () => challengeBooks.reduce((sum, item) => sum + item.words, 0),
    [],
  );
  const reviewedCount = useMemo(
    () =>
      challengeBooks.reduce(
        (count, book) => (challengeReviews[book.title] ? count + 1 : count),
        0,
      ),
    [challengeReviews],
  );
  const challengeProgressPercent = Math.round(
    (reviewedCount / challengeBooks.length) * 100,
  );

  const challengeMinutes = Math.round(challengeWordTotal / 200);

  async function runBookSearch(mode) {
    const isEducation = mode === "education";
    const query = isEducation ? educationQuery : fictionQuery;
    const category = isEducation ? educationCategory : fictionCategoriesSelected;
    const setLoading = isEducation ? setEducationLoading : setFictionLoading;
    const setError = isEducation ? setEducationError : setFictionError;
    const setResults = isEducation ? setEducationResults : setFictionResults;
    const setSearched = isEducation ? setEducationSearched : setFictionSearched;

    const hasCategory = Array.isArray(category) ? category.length > 0 : Boolean(category);
    if (!query.trim() && !hasCategory) return;
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const baseQuery = query.trim();
      const effectiveBaseQuery = baseQuery || "books";
      const categoryKey = Array.isArray(category) ? category.join(",") : category;
      const cacheKey = `${mode}|${categoryKey}|${effectiveBaseQuery.toLowerCase()}`;
      const cached = loadList(SEARCH_CACHE_KEY);
      const cachedEntry = cached.find((item) => item.key === cacheKey);
      if (cachedEntry) {
        setResults(cachedEntry.items);
        return;
      }

      const subjectQuery = Array.isArray(category)
        ? category.map((item) => `+subject:${item}`).join("")
        : category
          ? `+subject:${category}`
          : "";
      const primaryCategoryOnly = Array.isArray(category)
        ? category.length > 0
          ? `subject:${category.join("+subject:")}`
          : ""
        : category
          ? `subject:${category}`
          : "";
      const queryVariants = [
        `${effectiveBaseQuery}${subjectQuery}`,
        `${primaryCategoryOnly || effectiveBaseQuery}`,
        `intitle:${effectiveBaseQuery}${subjectQuery}`,
        effectiveBaseQuery,
      ];

      let data = null;
      let lastError = "";

      for (const q of queryVariants) {
        let response = null;
        let attempt = 0;

        while (attempt < 3) {
          const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=12&orderBy=relevance&printType=books${GOOGLE_BOOKS_API_KEY ? `&key=${encodeURIComponent(GOOGLE_BOOKS_API_KEY)}` : ""}`;
          response = await fetch(
            apiUrl,
          );

          if (response.status !== 429) break;
          attempt += 1;
          await sleep(800 * 2 ** (attempt - 1));
        }

        if (!response.ok) {
          lastError = `Google Books API error (${response.status})`;
          continue;
        }

        const json = await response.json();
        if ((json.items || []).length > 0) {
          data = json;
          break;
        }

        data = json;
      }

      if (!data) {
        throw new Error(lastError || "Unable to reach Google Books API");
      }

      const items = (data.items || []).map((book) => {
        const info = book.volumeInfo || {};
        const saleInfo = book.saleInfo || {};
        return {
          id: book.id,
          title: info.title || "Untitled",
          author: info.authors?.join(", ") || "Unknown Author",
          description: info.description || "No description available.",
          cover: info.imageLinks?.thumbnail || "",
          price: saleInfo.listPrice?.amount ?? null,
        };
      });
      setResults(items);

      const nextCache = [
        { key: cacheKey, items },
        ...cached.filter((entry) => entry.key !== cacheKey),
      ].slice(0, 20);
      saveList(SEARCH_CACHE_KEY, nextCache);
    } catch (err) {
      setError(
        err?.message?.includes("(429)")
          ? "Google Books is rate-limiting right now (429). Please wait about a minute, then try again."
          : err?.message || "Could not load books right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function addToCart(book) {
    if (cart.some((item) => item.id === book.id)) return;
    const next = [...cart, book];
    setCart(next);
    saveList(STORAGE_CART_KEY, next);
  }

  function addToLibrary(book) {
    if (library.some((item) => item.id === book.id)) return;
    const next = [...library, book];
    setLibrary(next);
    saveList(STORAGE_LIBRARY_KEY, next);
  }

  function clearCart() {
    if (cart.length > 0 && !window.confirm("Are you sure you want to clear your cart?")) {
      return;
    }
    // Remove notes associated with cart books
    setBookNotes((prev) => {
      const next = { ...prev };
      for (const book of cart) {
        const key = `cart:${book.id || book.title}`;
        delete next[key];
      }
      saveList(STORAGE_BOOK_NOTES_KEY, next);
      return next;
    });
    setCart([]);
    saveList(STORAGE_CART_KEY, []);
  }

  function clearLibrary() {
    if (
      library.length > 0 &&
      !window.confirm("Are you sure you want to clear your library?")
    ) {
      return;
    }
    // Remove notes associated with library books
    setBookNotes((prev) => {
      const next = { ...prev };
      for (const book of library) {
        const key = `library:${book.id || book.title}`;
        delete next[key];
      }
      saveList(STORAGE_BOOK_NOTES_KEY, next);
      return next;
    });
    setLibrary([]);
    saveList(STORAGE_LIBRARY_KEY, []);
  }

  function noteKey(source, book) {
    return `${source}:${book.id || book.title}`;
  }

  function setNote(source, book, note) {
    const key = noteKey(source, book);
    const next = { ...bookNotes, [key]: note };
    setBookNotes(next);
    saveList(STORAGE_BOOK_NOTES_KEY, next);
  }

  function submitForumQuestion(event) {
    event.preventDefault();
    setForumError("");
    const trimmedName = forumForm.name.trim();
    const trimmedEmail = forumForm.email.trim();
    const trimmedQuestion = forumForm.question.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail || !trimmedQuestion) {
      setForumError("Please complete all fields before submitting.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setForumError("Please enter a valid email address.");
      return;
    }

    const newPost = {
      id: Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      question: trimmedQuestion,
      createdAt: new Date().toLocaleString(),
    };

    const nextPosts = [newPost, ...forumPosts];
    setForumPosts(nextPosts);
    saveList(STORAGE_FORUM_KEY, nextPosts);
    setForumForm({ name: "", email: "", question: "" });
  }

  function openReviewModal(book) {
    const existingReview = challengeReviews[book.title];
    setActiveReviewBook(book);
    setReviewRating(existingReview?.rating || 1);
    setReviewText(existingReview?.text || "");
    setReviewError("");
  }

  function closeReviewModal() {
    setActiveReviewBook(null);
    setReviewError("");
  }

  function saveChallengeReview() {
    if (!activeReviewBook) return;
    const wordCount = (reviewText.trim().match(/[^\s]+/g) || []).length;
    if (wordCount < 100) {
      setReviewError("Review must be at least 100 words.");
      return;
    }

    const nextReviews = {
      ...challengeReviews,
      [activeReviewBook.title]: {
        rating: reviewRating,
        text: reviewText.trim(),
        updatedAt: new Date().toLocaleString(),
      },
    };
    setChallengeReviews(nextReviews);
    saveList(STORAGE_CHALLENGE_REVIEWS_KEY, nextReviews);
    closeReviewModal();
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">BookMatch</div>
        <nav className="nav">
          {["home", "education", "fiction", "challenge", "collection"].map((tab) => (
            <button
              key={tab}
              className={`nav-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      <main className="content">
        {activeTab === "home" && (
          <>
            <section className="panel hero hero-layout">
              <div>
                <h1>Find your next favorite book</h1>
                <p className="quote">
                  "Where every book finds its perfect reader."
                </p>
                <p>
                  A polished reading hub for discovery, challenge tracking, and
                  building a personal collection.
                </p>
                <button
                  className="cta-button"
                  onClick={() => setActiveTab("challenge")}
                >
                  Start the Reading Challenge
                </button>
              </div>
              <img className="hero-logo" src={logo} alt="BookMatch logo" />
            </section>

            <section className="panel">
              <h2>About BookMatch</h2>
              <p>
                BookMatch helps readers discover meaningful titles faster. The
                platform combines book search, a guided reading challenge, and a
                personal collection tracker so readers can move from interest to
                action in one place.
              </p>
              <div className="stat-grid">
                <article>
                  <h3>20+</h3>
                  <p>Books per search</p>
                </article>
                <article>
                  <h3>{library.length}</h3>
                  <p>Saved in your library</p>
                </article>
                <article>
                  <h3>{cart.length}</h3>
                  <p>Books in your cart</p>
                </article>
              </div>
            </section>

            <section className="panel">
              <h2>Why You Should Read</h2>
              <div className="feature-grid">
                {whyReadItems.map((item) => (
                  <article key={item.title} className="feature-card">
                    <img src={item.image} alt={item.title} />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <h2>Skills You Gain</h2>
              <div className="feature-grid">
                {skillItems.map((item) => (
                  <article key={item.title} className="feature-card">
                    <img src={item.image} alt={item.title} />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <h2>Forum: Ask a Question</h2>
              <p className="muted">
                Leave a question and it will appear in the community queue.
              </p>
              <form className="forum-form" onSubmit={submitForumQuestion}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={forumForm.name}
                  onChange={(event) =>
                    setForumForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={forumForm.email}
                  onChange={(event) =>
                    setForumForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
                <textarea
                  rows="4"
                  placeholder="Your question"
                  value={forumForm.question}
                  onChange={(event) =>
                    setForumForm((prev) => ({
                      ...prev,
                      question: event.target.value,
                    }))
                  }
                />
                <button type="submit">Submit Question</button>
              </form>
              {forumError && <p className="error">{forumError}</p>}

              <div className="forum-list">
                {forumPosts.length === 0 ? (
                  <p className="muted">No questions yet. Be the first to post.</p>
                ) : (
                  forumPosts.map((post) => (
                    <article key={post.id} className="forum-post">
                      <div className="forum-meta">
                        <strong>{post.name}</strong>
                        <span>{post.email}</span>
                        <span>{post.createdAt}</span>
                      </div>
                      <p>{post.question}</p>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === "education" && (
          <section className="panel">
            <h2>Book Search - Education</h2>
            <div className="controls">
              <input
                value={educationQuery}
                onChange={(event) => setEducationQuery(event.target.value)}
                placeholder="Search by title, author, or keyword"
              />
              <button
                onClick={() => runBookSearch("education")}
                disabled={educationLoading}
              >
                {educationLoading ? "Searching..." : "Search"}
              </button>
            </div>
            <div className="fiction-category-grid">
              <button
                type="button"
                className={`fiction-chip ${educationCategory === "" ? "selected" : ""}`}
                onClick={() => setEducationCategory("")}
              >
                All Categories
              </button>
              {educationCategories.map((item) => {
                const isSelected = educationCategory === item;
                return (
                  <button
                    key={item}
                    type="button"
                    className={`fiction-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => setEducationCategory(item)}
                  >
                    {item
                      .split(" ")
                      .map((word) => word[0].toUpperCase() + word.slice(1))
                      .join(" ")}
                  </button>
                );
              })}
            </div>
            {educationError && <p className="error">{educationError}</p>}
            {!educationError &&
              !educationLoading &&
              educationSearched &&
              educationResults.length === 0 &&
              (educationQuery.trim() || educationCategory) && (
              <p className="muted">
                No books found for that search. Try a broader keyword.
              </p>
              )}
            <div className="book-grid">
              {educationResults.map((book) => (
                <article key={book.id} className="book-card">
                  <div className="cover-wrap">
                    {book.cover ? (
                      <img src={book.cover} alt={book.title} />
                    ) : (
                      <div className="cover-placeholder">No Cover</div>
                    )}
                  </div>
                  <h3>{book.title}</h3>
                  <p className="muted">{book.author}</p>
                  <p className="muted">
                    {book.price ? `Rp ${book.price}` : "Price not available"}
                  </p>
                  <p>{book.description.slice(0, 140)}...</p>
                  <div className="card-actions">
                    {book.price ? (
                      <button
                        className={cart.some((item) => item.id === book.id) ? "added" : ""}
                        disabled={cart.some((item) => item.id === book.id)}
                        onClick={() => addToCart(book)}
                      >
                        {cart.some((item) => item.id === book.id)
                          ? "Added to Cart"
                          : "Add to Cart"}
                      </button>
                    ) : (
                      <button
                        className={library.some((item) => item.id === book.id) ? "added" : ""}
                        disabled={library.some((item) => item.id === book.id)}
                        onClick={() => addToLibrary(book)}
                      >
                        {library.some((item) => item.id === book.id)
                          ? "Added to Library"
                          : "Add to Library"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "fiction" && (
          <section className="panel">
            <h2>Book Search - Fiction</h2>
            <div className="controls">
              <input
                value={fictionQuery}
                onChange={(event) => setFictionQuery(event.target.value)}
                placeholder="Search by title, author, or keyword"
              />
              <button
                onClick={() => runBookSearch("fiction")}
                disabled={fictionLoading}
              >
                {fictionLoading ? "Searching..." : "Search"}
              </button>
            </div>
            <div className="fiction-category-grid">
              {fictionCategories.map((item) => {
                const isSelected = fictionCategoriesSelected.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    className={`fiction-chip ${isSelected ? "selected" : ""}`}
                    onClick={() =>
                      setFictionCategoriesSelected((prev) =>
                        prev.includes(item)
                          ? prev.filter((value) => value !== item)
                          : [...prev, item],
                      )
                    }
                  >
                    {item
                      .split(" ")
                      .map((word) => word[0].toUpperCase() + word.slice(1))
                      .join(" ")}
                  </button>
                );
              })}
            </div>
            {fictionError && <p className="error">{fictionError}</p>}
            {!fictionError &&
              !fictionLoading &&
              fictionSearched &&
              fictionResults.length === 0 &&
              (fictionQuery.trim() || fictionCategoriesSelected.length > 0) && (
                <p className="muted">
                  No books found for that search. Try a broader keyword.
                </p>
              )}
            <div className="book-grid">
              {fictionResults.map((book) => (
                <article key={book.id} className="book-card">
                  <div className="cover-wrap">
                    {book.cover ? (
                      <img src={book.cover} alt={book.title} />
                    ) : (
                      <div className="cover-placeholder">No Cover</div>
                    )}
                  </div>
                  <h3>{book.title}</h3>
                  <p className="muted">{book.author}</p>
                  <p className="muted">
                    {book.price ? `Rp ${book.price}` : "Price not available"}
                  </p>
                  <p>{book.description.slice(0, 140)}...</p>
                  <div className="card-actions">
                    {book.price ? (
                      <button
                        className={cart.some((item) => item.id === book.id) ? "added" : ""}
                        disabled={cart.some((item) => item.id === book.id)}
                        onClick={() => addToCart(book)}
                      >
                        {cart.some((item) => item.id === book.id)
                          ? "Added to Cart"
                          : "Add to Cart"}
                      </button>
                    ) : (
                      <button
                        className={library.some((item) => item.id === book.id) ? "added" : ""}
                        disabled={library.some((item) => item.id === book.id)}
                        onClick={() => addToLibrary(book)}
                      >
                        {library.some((item) => item.id === book.id)
                          ? "Added to Library"
                          : "Add to Library"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "challenge" && (
          <div className="challenge-layout">
            <section className="panel challenge-main">
              <div>
                <h2>Reading Challenge</h2>
                <p>
                  Complete 10 curated titles and strengthen comprehension, critical
                  thinking, and vocabulary.
                </p>
              </div>
            <div className="challenge-grid">
              {challengeBooks.map((book) => (
                <article key={book.title} className="challenge-item challenge-link">
                  <img src={book.image} alt={book.title} />
                  <h3>{book.title}</h3>
                  <p>{book.words.toLocaleString()} words</p>
                  {challengeReviews[book.title] && (
                    <p className="challenge-rating">
                      {"★".repeat(challengeReviews[book.title].rating)}
                      {"☆".repeat(5 - challengeReviews[book.title].rating)}{" "}
                      ({challengeReviews[book.title].rating}/5)
                    </p>
                  )}
                  <div className="challenge-card-actions">
                    <a href={book.link} target="_blank" rel="noreferrer">
                      Open on Google Books
                    </a>
                    <button
                      type="button"
                      className={
                        challengeReviews[book.title]
                          ? "challenge-edit-review"
                          : "challenge-write-review"
                      }
                      onClick={() => openReviewModal(book)}
                    >
                      {challengeReviews[book.title] ? "Edit Review" : "Write Review"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
            </section>
            <aside className="panel challenge-side">
              <div className="section-title-row">
                <strong>Reading Progress</strong>
                <span>{reviewedCount}/{challengeBooks.length}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${challengeProgressPercent}%` }}
                />
              </div>
              <p className="muted">{challengeProgressPercent}% completed</p>
              <div className="metrics">
                <p>
                  <strong>Total words:</strong> {challengeWordTotal.toLocaleString()}
                </p>
                <p>
                  <strong>Estimated reading time:</strong> {challengeMinutes} minutes
                </p>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "collection" && (
          <section className="panel">
            <h2>Your Collection</h2>
            <div className="split">
              <div className="collection-subpanel">
                <div className="section-title-row collection-title-row">
                  <h3>Cart</h3>
                  <button className="danger" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="muted">No books in cart.</p>
                ) : (
                  <div className="collection-list">
                    {cart.map((book) => (
                      <div key={book.id} className="collection-book">
                        <img
                          className="collection-book-cover"
                          src={book.cover || ""}
                          alt={book.title}
                        />
                        <div className="collection-book-body">
                          <div className="collection-book-top">
                            <div>
                              <div className="collection-book-title">
                                {book.title}
                              </div>
                              <div className="muted">{book.author}</div>
                              <div className="collection-book-price">
                                {formatRp(book.price)}
                              </div>
                            </div>
                          </div>
                          <label className="collection-note-label">
                            Notes
                          </label>
                          <textarea
                            className="collection-note-input"
                            rows={3}
                            value={bookNotes[noteKey("cart", book)] || ""}
                            onChange={(e) =>
                              setNote("cart", book, e.target.value)
                            }
                            placeholder="Add your notes about this book..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="total">
                  Total Price: <strong>{formatRp(totalPrice)}</strong>
                </p>
              </div>

              <div className="collection-subpanel">
                <div className="section-title-row collection-title-row">
                  <h3>Library</h3>
                  <button className="danger" onClick={clearLibrary}>
                    Clear Library
                  </button>
                </div>

                {library.length === 0 ? (
                  <p className="muted">No books in library.</p>
                ) : (
                  <div className="collection-list">
                    {library.map((book) => (
                      <div key={book.id} className="collection-book">
                        <img
                          className="collection-book-cover"
                          src={book.cover || ""}
                          alt={book.title}
                        />
                        <div className="collection-book-body">
                          <div className="collection-book-top">
                            <div>
                              <div className="collection-book-title">
                                {book.title}
                              </div>
                              <div className="muted">{book.author}</div>
                              <div className="collection-book-price">
                                {formatRp(book.price)}
                              </div>
                            </div>
                          </div>
                          <label className="collection-note-label">
                            Notes
                          </label>
                          <textarea
                            className="collection-note-input"
                            rows={3}
                            value={bookNotes[noteKey("library", book)] || ""}
                            onChange={(e) =>
                              setNote("library", book, e.target.value)
                            }
                            placeholder="Add your notes about this book..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {activeReviewBook && (
        <div className="review-modal-overlay" onClick={closeReviewModal}>
          <div className="review-modal" onClick={(event) => event.stopPropagation()}>
            <div className="review-modal-header">
              <h3>Rate "{activeReviewBook.title}"</h3>
              <button type="button" onClick={closeReviewModal}>
                ×
              </button>
            </div>
            <div className="review-modal-body">
              <h4>Rate the book:</h4>
              <div className="star-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= reviewRating ? "filled" : ""}`}
                    onClick={() => setReviewRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <label htmlFor="reviewInput">Review (at least 100 words):</label>
              <textarea
                id="reviewInput"
                rows="10"
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
              />
              <p className="muted">
                Word count: {(reviewText.trim().match(/[^\s]+/g) || []).length}
              </p>
              {reviewError && <p className="error">{reviewError}</p>}
            </div>
            <div className="review-modal-footer">
              <button type="button" className="save-review" onClick={saveChallengeReview}>
                Save
              </button>
              <button type="button" className="close-review" onClick={closeReviewModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
