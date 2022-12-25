export class GalleryDoesntExistException extends Error {
  public static readonly message = "Gallery doesn't exist!";

  constructor() {
    super(GalleryDoesntExistException.message);
  }
}

export class FileDoesntExistException extends Error {
  public static readonly message = "File doesn't exist!";

  constructor() {
    super(FileDoesntExistException.message);
  }
}

export class AccessDeniedException extends Error {
  public static readonly message = 'Access denied!';

  constructor() {
    super(AccessDeniedException.message);
  }
}
