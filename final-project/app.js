import express from 'express';
import eventsRouter from './routers/eventsRouter.js';
import attendanceRouter from './routers/attendanceRouter.js';
import membersRouter from './routers/membersRouter.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'text/html' }));
app.use(express.raw({ type: 'text/xml' }));
//excel export todo
app.use(express.json());

app.use('/members', membersRouter);
app.use('/events', eventsRouter);
app.use('/attendance', attendanceRouter);

app.use((err, req, res, next) => {
    handleError(err, res);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}...`);
});