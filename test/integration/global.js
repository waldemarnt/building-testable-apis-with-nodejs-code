before(()=> {
  return setupApp()
    .then(app => {
      global.request = supertest(app)
    });
});
