import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

import {User} from '../types/User';
import {Deck} from '../types/Deck';
import {Card} from '../types/Card';

// Enable promise for SQLite
enablePromise(true);

export const connectToDatabase = async (): Promise<SQLiteDatabase> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase(
      {name: 'pengucards.db', location: 'default'},
      () => {
        // Enable foreign key constraints
        db.executeSql(
          'PRAGMA foreign_keys = ON;',
          [],
          () => {
            console.log('Foreign keys enabled.');
            resolve(db);
          },
          error => {
            console.error('Error enabling foreign keys', error);
            reject(new Error('Error enabling foreign keys'));
          },
        );
      },
      error => {
        console.error(error);
        reject(new Error('Could not connect to database'));
      },
    );
  });
};

export const createTables = async (db: SQLiteDatabase) => {
  const userQuery = `
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )`;
  const deckQuery = `
    CREATE TABLE IF NOT EXISTS Deck (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
    )`;
  const cardQuery = `
    CREATE TABLE IF NOT EXISTS Card (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      hint TEXT,
      image TEXT,
      deck_id INTEGER,
      FOREIGN KEY (deck_id) REFERENCES Deck(id) ON DELETE CASCADE
    )`;

  try {
    await db.executeSql(userQuery);
    await db.executeSql(deckQuery);
    await db.executeSql(cardQuery);
  } catch (error) {
    console.error(error);
    throw Error('Failed to create tables');
  }
};

// CREATE functions

export const addUser = async (db: SQLiteDatabase, user: User) => {
  const insertQuery = `
      INSERT INTO User (name, email)
      VALUES (?, ?)
  `;
  const values = [user.name, user.email];
  try {
    return await db.executeSql(insertQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add user');
  }
};

export const addDeck = async (db: SQLiteDatabase, deck: Deck) => {
  // Ensure the referenced user_id exists
  const userQuery = `
      SELECT id FROM User WHERE id = ?
  `;
  try {
    const result = await db.executeSql(userQuery, [deck.user_id]);
    if (result[0].rows.length === 0) {
      throw new Error(`User with id ${deck.user_id} does not exist`);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify user_id for deck');
  }

  const insertQuery = `
      INSERT INTO Deck (title, user_id)
      VALUES (?, ?)
  `;
  const values = [deck.title, deck.user_id];
  try {
    return await db.executeSql(insertQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add deck');
  }
};

export const addCard = async (db: SQLiteDatabase, card: Card) => {
  // Ensure the referenced deck_id exists
  const deckQuery = `
      SELECT id FROM Deck WHERE id = ?
  `;
  try {
    const result = await db.executeSql(deckQuery, [card.deck_id]);
    if (result[0].rows.length === 0) {
      throw new Error(`Deck with id ${card.deck_id} does not exist`);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify deck_id for card');
  }

  const insertQuery = `
      INSERT INTO Card (image, front, back, hint, deck_id)
      VALUES (?, ?, ?, ?, ?)
  `;
  const values = [card.image, card.front, card.back, card.hint, card.deck_id];
  try {
    return await db.executeSql(insertQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add card');
  }
};

// UPDATE functions

export const updateUser = async (db: SQLiteDatabase, user: User) => {
  const updateQuery = `
    UPDATE User
    SET name = ?, email = ?
    WHERE id = ?
  `;
  const values = [user.name, user.email, user.id];
  try {
    return await db.executeSql(updateQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update user');
  }
};

export const updateDeck = async (db: SQLiteDatabase, deck: Deck) => {
  // Ensure the referenced user_id exists
  const userQuery = `
    SELECT id FROM User WHERE id = ?
  `;
  try {
    const result = await db.executeSql(userQuery, [deck.user_id]);
    if (result[0].rows.length === 0) {
      throw new Error(`User with id ${deck.user_id} does not exist`);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify user_id for deck');
  }

  const updateQuery = `
    UPDATE Deck
    SET title = ?, user_id = ?
    WHERE id = ?
  `;
  const values = [deck.title, deck.user_id, deck.id];
  try {
    return await db.executeSql(updateQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update deck');
  }
};

export const updateCard = async (db: SQLiteDatabase, card: Card) => {
  // Ensure the referenced deck_id exists
  const deckQuery = `
    SELECT id FROM Deck WHERE id = ?
  `;
  try {
    const result = await db.executeSql(deckQuery, [card.deck_id]);
    if (result[0].rows.length === 0) {
      throw new Error(`Deck with id ${card.deck_id} does not exist`);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify deck_id for card');
  }

  const updateQuery = `
    UPDATE Card
    SET image = ?, front = ?, back = ?, hint = ?, deck_id = ?
    WHERE id = ?
  `;
  const values = [
    card.image,
    card.front,
    card.back,
    card.hint,
    card.deck_id,
    card.id,
  ];
  try {
    return await db.executeSql(updateQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update card');
  }
};

// DELETE functions

export const deleteUser = async (db: SQLiteDatabase, userId: number) => {
  const deleteQuery = `
    DELETE FROM User
    WHERE id = ?
  `;
  try {
    return await db.executeSql(deleteQuery, [userId]);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete user');
  }
};

export const deleteDeck = async (db: SQLiteDatabase, deckId: number) => {
  const deleteQuery = `
    DELETE FROM Deck
    WHERE id = ?
  `;
  try {
    return await db.executeSql(deleteQuery, [deckId]);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete deck');
  }
};

export const deleteCard = async (db: SQLiteDatabase, cardId: number) => {
  const deleteQuery = `
    DELETE FROM Card
    WHERE id = ?
  `;
  try {
    return await db.executeSql(deleteQuery, [cardId]);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete card');
  }
};

// READ functions
export const getUser = async (id: number): Promise<User | null> => {
  const db = await connectToDatabase();
  const query = 'SELECT * FROM User WHERE id = ?';
  try {
    const results = await db.executeSql(query, [id]);
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user', error);
    throw new Error('Failed to fetch user');
  }
};

export const getDeck = async (id: number): Promise<Deck | null> => {
  const db = await connectToDatabase();
  const query = 'SELECT * FROM Deck WHERE id = ?';
  try {
    const results = await db.executeSql(query, [id]);
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch deck', error);
    throw new Error('Failed to fetch deck');
  }
};

export const getDecksByUser = async (userId: number): Promise<Deck[]> => {
  const db = await connectToDatabase();
  const query = 'SELECT * FROM Deck WHERE user_id = ?';
  try {
    const results = await db.executeSql(query, [userId]);
    const decks: Deck[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      decks.push(results[0].rows.item(i));
    }
    return decks;
  } catch (error) {
    console.error('Failed to fetch decks', error);
    throw new Error('Failed to fetch decks');
  }
};

export const getCardsByDeck = async (deckId: number): Promise<Card[]> => {
  const db = await connectToDatabase();
  const query = 'SELECT * FROM Card WHERE deck_id = ?';
  try {
    const results = await db.executeSql(query, [deckId]);
    const cards: Card[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      cards.push(results[0].rows.item(i));
    }
    return cards;
  } catch (error) {
    console.error('Failed to fetch cards', error);
    throw new Error('Failed to fetch cards');
  }
};

export const getCard = async (id: number): Promise<Card | null> => {
  const db = await connectToDatabase();
  const query = 'SELECT * FROM Card WHERE id = ?';
  try {
    const results = await db.executeSql(query, [id]);
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch card', error);
    throw new Error('Failed to fetch card');
  }
};

// generate and insert filler data
export const generateFillerData = async (db: SQLiteDatabase) => {
  const user: User = {id: 1, name: 'John Doe', email: 'john.doe@example.com'};

  const decks: Deck[] = [
    {id: 1, title: 'Deck 1', user_id: user.id, cards: [], cardsCount: 0},
    {id: 2, title: 'Deck 2', user_id: user.id, cards: [], cardsCount: 0},
    {id: 3, title: 'Deck 3', user_id: user.id, cards: [], cardsCount: 0},
  ];

  const cards: Card[] = [];

  for (let deck of decks) {
    for (let i = 1; i <= 20; i++) {
      const dummyCard = {
        id: i,
        front: `Front text for card ${i} in ${deck.title}`,
        back: `Back text for card ${i} in ${deck.title}`,
        hint: `Hint for card ${i} in ${deck.title}`,
        deck_id: deck.id,
      };
      cards.push(dummyCard);
    }
  }

  try {
    // Add user
    await addUser(db, user);

    // Add decks
    for (let deck of decks) {
      await addDeck(db, deck);
    }

    // Add cards
    for (let card of cards) {
      await addCard(db, card);
    }
  } catch (error) {
    console.error('Failed to generate filler data', error);
  }
};