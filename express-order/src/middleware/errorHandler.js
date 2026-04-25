const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      message: "Validasi gagal",
      errors,
    });
  }

  if (err.type === "validation") {
    return res.status(422).json({
      success: false,
      message: "Validasi gagal",
      errors: err.errors,
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server",
  });
};

export default errorHandler;
