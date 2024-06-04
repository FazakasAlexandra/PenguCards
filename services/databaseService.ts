import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

import {User} from '../types/User';
import {Deck} from '../types/Deck';
import {Card} from '../types/Card';

export const connectToDatabase = async () => {
  return openDatabase(
    {name: 'pengucards.db', location: 'default'},
    () => {},
    error => {
      console.error(error);
      throw Error('Could not connect to database');
    },
  );
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
      cards_count INTEGER,
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
  try {
    return await db.executeSql(
      `INSERT INTO User (name, email) VALUES ('${user.name}', '${user.email}')`,
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add user');
  }
};

export const addDeck = async (db: SQLiteDatabase, deck: Deck) => {
  // Ensure the referenced user_id exists
  try {
    const result = await db.executeSql(
      `SELECT id FROM User WHERE id = ${deck.user_id}`,
    );
    if (result[0].rows.length === 0) {
      throw new Error(`User with id ${deck.user_id} does not exist`);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify user_id for deck');
  }
  try {
    return await db.executeSql(
      `INSERT INTO Deck (title, user_id, cards_count) 
      VALUES ('${deck.title}', ${deck.user_id}, 0)`,
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add deck');
  }
};

export const addCard = async (db: SQLiteDatabase, card: Card) => {
  // Ensure the referenced deck_id exists
  try {
    const result = await db.executeSql(
      `SELECT id FROM Deck WHERE id = ${card.deck_id}`,
    );
    if (result[0].rows.length === 0) {
      throw new Error(`Deck with id ${card.deck_id} does not exist`);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify deck_id for card');
  }
  try {
    return await db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO Card (image, front, back, hint, deck_id) 
        VALUES ('${card.image}', '${card.front}', '${card.back}', '${card.hint}', ${card.deck_id})`,
      );
      tx.executeSql(
        `UPDATE Deck 
        SET cards_count = (SELECT COUNT(*) FROM Card 
        WHERE deck_id = ${card.deck_id})`,
      );
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add card');
  }
};

// UPDATE functions

export const updateUser = async (db: SQLiteDatabase, user: User) => {
  try {
    return await db.executeSql(
      `UPDATE User 
      SET name = '${user.name}', email = '${user.email}' 
      WHERE id = ${user.id}`,
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update user');
  }
};

export const updateDeck = async (db: SQLiteDatabase, deck: Deck) => {
  // Ensure the referenced user_id exists
  try {
    const result = await db.executeSql(
      `SELECT id FROM User WHERE id = ${deck.user_id}`,
    );
    if (result[0].rows.length === 0) {
      throw new Error(`User with id ${deck.user_id} does not exist`);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify user_id for deck');
  }
  try {
    return await db.executeSql(
      `UPDATE Deck 
      SET title = '${deck.title}', user_id = '${deck.user_id}' 
      WHERE id = ${deck.id}`,
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update deck');
  }
};

export const updateCard = async (db: SQLiteDatabase, card: Card) => {
  // Ensure the referenced deck_id exists
  try {
    const result = await db.executeSql(
      `SELECT id FROM Deck WHERE id = ${card.deck_id}`,
    );
    if (result[0].rows.length === 0) {
      throw new Error(`Deck with id ${card.deck_id} does not exist`);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify deck_id for card');
  }
  try {
    return await db.executeSql(
      `UPDATE Card 
      SET image = '${card.image}', front = '${card.front}', back = '${card.back}', hint = '${card.hint}', deck_id = ${card.deck_id} 
      WHERE id = ${card.id}`,
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update card');
  }
};

// DELETE functions

export const deleteUser = async (db: SQLiteDatabase, userId: number) => {
  try {
    return await db.executeSql(`DELETE FROM User WHERE id = ${userId}`);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete user');
  }
};

export const deleteDeck = async (db: SQLiteDatabase, deckId: number) => {
  try {
    return await db.executeSql(`DELETE FROM Deck WHERE id = ${deckId}`);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete deck');
  }
};

export const deleteCard = async (db: SQLiteDatabase, cardId: number) => {
  try {
    return await db.executeSql(`DELETE FROM Card WHERE id = ${cardId}`);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete card');
  }
};

// READ functions
export const getUser = async (userId: number): Promise<User | null> => {
  const db = await connectToDatabase();
  try {
    const results = await db.executeSql(
      `SELECT * FROM User WHERE id = ${userId}`,
    );
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user', error);
    throw new Error('Failed to fetch user');
  }
};

export const getDeck = async (cardId: number): Promise<Deck | null> => {
  const db = await connectToDatabase();
  try {
    const results = await db.executeSql(
      `SELECT * FROM Deck WHERE id = ${cardId}`,
    );
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
  try {
    const results = await db.executeSql(
      `SELECT * FROM Deck WHERE user_id = ${userId}`,
    );
    const decks: Deck[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      decks.push(results[0].rows.item(i));
    }
    return decks;
  } catch (error) {
    throw new Error('Failed to fetch decks');
  }
};

export const searchDecksByTitle = async (searchString: string) => {
  try {
    const db = await connectToDatabase();
    const query = `SELECT * FROM Deck WHERE title LIKE '%${searchString}%'`;

    const decks: Deck[] = [];
    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let i = 0; i < result.rows.length; i++) {
        decks.push(result.rows.item(i));
      }
    });
    console.log('decks !!', decks);

    return decks;
  } catch (error) {
    console.error('Failed to search decks by title:', error);
    return [];
  }
};

export const getCardsByDeck = async (
  deckId: number,
  limit: number,
  offset: number,
): Promise<Card[]> => {
  const db = await connectToDatabase();
  try {
    const results = await db.executeSql(
      `SELECT * FROM Card WHERE deck_id = ${deckId}
      LIMIT ${limit} OFFSET ${offset}`,
    );
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

export const getCardById = async (id: number): Promise<Card | null> => {
  const db = await connectToDatabase();
  try {
    const results = await db.executeSql(`SELECT * FROM Card WHERE id = ${id}`);
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch card', error);
    throw new Error('Failed to fetch card');
  }
};

export const searchCardsByText = async (
  searchString: string,
  limit: number,
  offset: number,
): Promise<Card[]> => {
  try {
    const db = await connectToDatabase();

    const results = await db.executeSql(
      `SELECT * FROM Card 
      WHERE front LIKE '%${searchString}%' OR back LIKE '%${searchString}%'
      LIMIT ${limit} OFFSET ${offset}`,
    );

    const cards: Card[] = [];
    results.forEach(result => {
      for (let i = 0; i < result.rows.length; i++) {
        cards.push(result.rows.item(i));
      }
    });
    return cards;
  } catch (error) {
    console.error('Failed to search cards by text:', error);
    return [];
  }
};

export const generateFillerData = async (db: SQLiteDatabase) => {
  const user: User = {id: 1, name: 'John Doe', email: 'john.doe@example.com'};

  const decks: Deck[] = [
    {id: 1, title: 'Deck 1', user_id: user.id, cardsCount: 0, cards: []},
    {id: 2, title: 'Deck 2', user_id: user.id, cardsCount: 0, cards: []},
    {id: 3, title: 'Deck 3', user_id: user.id, cardsCount: 0, cards: []},
  ];

  const cards: Card[] = [];

  for (let deck of decks) {
    for (let i = 1; i <= 20; i++) {
      const fillerCard = {
        id: i,
        front: `Front text for card ${i} in ${deck.title}`,
        back: `Back text for card ${i} in ${deck.title}`,
        hint: `Hint for card ${i} in ${deck.title}`,
        deck_id: deck.id,
      };
      cards.push(fillerCard);
      deck.cards.push(fillerCard);
    }
  }

  try {
    await addUser(db, user);
    for (let deck of decks) {
      await addDeck(db, deck);
    }
    for (let card of cards) {
      await addCard(db, card);
    }
  } catch (error) {
    console.error('Failed to generate filler data', error);
  }
};

export const initDatabase = async () => {
  try {
    const db = await connectToDatabase();
    enablePromise(true);
    await db.executeSql('PRAGMA foreign_keys = ON');
    await createTables(db);
    // await generateFillerData(db);
  } catch (error) {
    console.error(error);
  }
};
