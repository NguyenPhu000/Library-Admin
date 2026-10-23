import { BOOK_STATUS, LOAN_STATUS, type BookDetail, type BookItem, type Loan } from '../../features/books/types/book';

const INITIAL_SEED_BOOKS: BookItem[] = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publishedYear: 2008,
    isbn: '978-0-13-235088-4',
    publisher: 'Prentice Hall',
    edition: '1st Edition',
    description: 'A handbook of agile software craftsmanship.',
    totalCopies: 4,
    tags: ['Programming'],
    status: BOOK_STATUS.AVAILABLE,
    addedOn: '2026-08-10',
    createdAt: '2026-08-10T08:00:00.000Z',
    updatedAt: '2026-08-10T08:00:00.000Z',
  },
  {
    id: 2,
    title: 'The Pragmatic Programmer',
    author: 'David Thomas, Andrew Hunt',
    publishedYear: 2019,
    isbn: '978-0-13-595705-9',
    publisher: 'Addison-Wesley',
    edition: '20th Anniversary Edition',
    description: 'Your journey to mastery in software development.',
    totalCopies: 5,
    tags: ['Programming', 'Career'],
    status: BOOK_STATUS.AVAILABLE,
    addedOn: '2026-09-12',
    createdAt: '2026-09-12T08:00:00.000Z',
    updatedAt: '2026-09-12T08:00:00.000Z',
  },
  {
    id: 3,
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    publishedYear: 2017,
    isbn: '978-1-44-937332-0',
    publisher: "O'Reilly Media",
    edition: '1st Edition',
    description: 'The big ideas behind reliable, scalable, and maintainable systems.',
    totalCopies: 0,
    tags: ['Database'],
    status: BOOK_STATUS.OUT_OF_STOCK,
    addedOn: '2026-07-20',
    createdAt: '2026-07-20T08:00:00.000Z',
    updatedAt: '2026-07-20T08:00:00.000Z',
  },
  {
    id: 4,
    title: 'Refactoring',
    author: 'Martin Fowler',
    publishedYear: 2018,
    isbn: '978-0-13-475759-9',
    publisher: 'Addison-Wesley',
    edition: '2nd Edition',
    description: 'Improving the design of existing code.',
    totalCopies: 3,
    tags: ['Programming'],
    status: BOOK_STATUS.AVAILABLE,
    addedOn: '2026-08-15',
    createdAt: '2026-08-15T08:00:00.000Z',
    updatedAt: '2026-08-15T08:00:00.000Z',
  },
  {
    id: 5,
    title: "You Don't Know JS Yet",
    author: 'Kyle Simpson',
    publishedYear: 2020,
    isbn: '978-1-69-829795-8',
    publisher: 'Independently published',
    edition: '2nd Edition',
    description: 'Get started with core JavaScript mechanisms.',
    totalCopies: 5,
    tags: ['JavaScript'],
    status: BOOK_STATUS.AVAILABLE,
    addedOn: '2026-09-01',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 6,
    title: 'Node.js Design Patterns',
    author: 'Mario Casciaro, Luciano Mammino',
    publishedYear: 2020,
    isbn: '978-1-83-921411-0',
    publisher: 'Packt Publishing',
    edition: '3rd Edition',
    description: 'Master best practice architectures and design patterns in Node.js.',
    totalCopies: 1,
    tags: ['Node.js', 'JavaScript'],
    status: BOOK_STATUS.AVAILABLE,
    addedOn: '2026-09-18',
    createdAt: '2026-09-18T08:00:00.000Z',
    updatedAt: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 7,
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    publishedYear: 2018,
    isbn: '978-1-59-327950-9',
    publisher: 'No Starch Press',
    edition: '3rd Edition',
    description: 'A modern introduction to programming with JavaScript.',
    totalCopies: 0,
    tags: ['JavaScript'],
    status: BOOK_STATUS.OUT_OF_STOCK,
    addedOn: '2026-06-25',
    createdAt: '2026-06-25T08:00:00.000Z',
    updatedAt: '2026-06-25T08:00:00.000Z',
  },
  {
    id: 8,
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    publishedYear: 2003,
    isbn: '978-0-32-112521-7',
    publisher: 'Addison-Wesley',
    edition: '1st Edition',
    description: 'Tackling complexity in the heart of software.',
    totalCopies: 2,
    tags: ['Architecture'],
    status: BOOK_STATUS.AVAILABLE,
    addedOn: '2026-05-14',
    createdAt: '2026-05-14T08:00:00.000Z',
    updatedAt: '2026-05-14T08:00:00.000Z',
  },
];

const INITIAL_SEED_LOANS: Loan[] = [
  {
    id: 1,
    bookId: 2,
    memberId: 101,
    memberName: 'Minh Tran',
    borrowedDate: '2026-10-15',
    dueDate: '2026-10-29',
    returnedDate: null,
    status: LOAN_STATUS.ACTIVE,
  },
  {
    id: 2,
    bookId: 2,
    memberId: 102,
    memberName: 'Lan Pham',
    borrowedDate: '2026-10-02',
    dueDate: '2026-10-16',
    returnedDate: null,
    status: LOAN_STATUS.OVERDUE,
  },
  {
    id: 3,
    bookId: 2,
    memberId: 103,
    memberName: 'Huy Nguyen',
    borrowedDate: '2026-10-10',
    dueDate: '2026-10-24',
    returnedDate: null,
    status: LOAN_STATUS.ACTIVE,
  },
  {
    id: 4,
    bookId: 2,
    memberId: 104,
    memberName: 'Thao Le',
    borrowedDate: '2026-09-20',
    dueDate: '2026-10-04',
    returnedDate: '2026-10-03',
    status: LOAN_STATUS.RETURNED,
  },
  {
    id: 5,
    bookId: 2,
    memberId: 105,
    memberName: 'Khoa Vo',
    borrowedDate: '2026-09-01',
    dueDate: '2026-09-15',
    returnedDate: '2026-09-14',
    status: LOAN_STATUS.RETURNED,
  },
  {
    id: 6,
    bookId: 1,
    memberId: 106,
    memberName: 'An Nguyen',
    borrowedDate: '2026-10-12',
    dueDate: '2026-10-26',
    returnedDate: null,
    status: LOAN_STATUS.ACTIVE,
  },
  {
    id: 7,
    bookId: 4,
    memberId: 107,
    memberName: 'Binh Le',
    borrowedDate: '2026-10-11',
    dueDate: '2026-10-25',
    returnedDate: null,
    status: LOAN_STATUS.ACTIVE,
  },
];

export let SEED_BOOKS: BookItem[] = structuredClone(INITIAL_SEED_BOOKS);
export let SEED_LOANS: Loan[] = structuredClone(INITIAL_SEED_LOANS);

export function resetSeedData(): void {
  SEED_BOOKS = structuredClone(INITIAL_SEED_BOOKS);
  SEED_LOANS = structuredClone(INITIAL_SEED_LOANS);
}

export function getSeedBookLoans(bookId: number): Loan[] {
  return SEED_LOANS.filter((loan) => loan.bookId === bookId);
}

export function getSeedBookDetail(id: number): BookDetail | undefined {
  const book = SEED_BOOKS.find((item) => item.id === id);
  if (!book) {
    return undefined;
  }

  const bookLoans = getSeedBookLoans(book.id);
  const onLoan = bookLoans.filter(
    (loan) => loan.status === LOAN_STATUS.ACTIVE || loan.status === LOAN_STATUS.OVERDUE,
  ).length;
  const available = Math.max(0, book.totalCopies - onLoan);

  return {
    ...book,
    onLoan,
    available,
  };
}

export function removeSeedBook(id: number): boolean {
  const index = SEED_BOOKS.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }
  SEED_BOOKS.splice(index, 1);
  SEED_LOANS = SEED_LOANS.filter((loan) => loan.bookId !== id);
  return true;
}

export const SEED_TAGS: string[] = Array.from(
  new Set(INITIAL_SEED_BOOKS.flatMap((book) => book.tags)),
);
