import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

// Enable promise for SQLite
enablePromise(true);

type User = {
  id: number; // Primary key, auto-incremented
  name: string; // Non-null text
  email: string; // Text, can be null
};

type Deck = {
  id: number;
  name: string;
  user_id: number | null; // Foreign key referencing User.id, can be null
};

type Card = {
  id: number; // Primary key, auto-incremented
  front: string; // Non-null text
  back: string; // Non-null text
  hint: string | null; // Text, can be null
  deck_id: number; // Foreign key referencing Deck.id
};

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
      name TEXT NOT NULL,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
    )`;
  const cardQuery = `
    CREATE TABLE IF NOT EXISTS Card (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      hint TEXT,
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

// Functions to add User, Deck, and Card
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
      INSERT INTO Deck (name, user_id)
      VALUES (?, ?)
  `;
  const values = [deck.name, deck.user_id];
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
      INSERT INTO Card (front, back, hint, deck_id)
      VALUES (?, ?, ?, ?)
  `;
  const values = [card.front, card.back, card.hint, card.deck_id];
  try {
    return await db.executeSql(insertQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add card');
  }
};

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
    SET name = ?, user_id = ?
    WHERE id = ?
  `;
  const values = [deck.name, deck.user_id, deck.id];
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
    SET front = ?, back = ?, hint = ?, deck_id = ?
    WHERE id = ?
  `;
  const values = [card.front, card.back, card.hint, card.deck_id, card.id];
  try {
    return await db.executeSql(updateQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update card');
  }
};

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

// generate and insert filler data
export const generateFillerData = async (db: SQLiteDatabase) => {
  const user: User = {id: 1, name: 'John Doe', email: 'john.doe@example.com'};

  const decks: Deck[] = [
    {id: 1, name: 'Deck 1', user_id: user.id},
    {id: 2, name: 'Deck 2', user_id: user.id},
    {id: 3, name: 'Deck 3', user_id: user.id},
  ];

  const cards: Card[] = [];

  for (let deck of decks) {
    for (let i = 1; i <= 20; i++) {
      cards.push({
        id: i,
        front: `Front text for card ${i} in ${deck.name}`,
        back: `Back text for card ${i} in ${deck.name}`,
        hint: `Hint for card ${i} in ${deck.name}`,
        deck_id: deck.id,
      });
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
