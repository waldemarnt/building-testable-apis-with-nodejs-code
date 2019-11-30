import app from './app';
const port = 3000;

app()
 .then(app => app.listen(port, () => console.log(`app running on port ${port}`)))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });
