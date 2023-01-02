(async () => {
  try {
    console.log('Building static files...');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
