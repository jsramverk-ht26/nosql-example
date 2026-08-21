process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import server from '../app.js';
import { connectDB } from '../database.js';

// collection name
const COLL_NAME = "courses";

chai.use(chaiHttp);

chai.should();


describe('courses', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await connectDB();
            
            try {
                await db.collection(COLL_NAME).drop();
            } catch(error) {
                console.error(error);
            } finally {
                resolve();
            }
        });
    });

    describe('GET /api/courses', () => {
        it('200 HAPPY PATH', (done) => {
            request.execute(server)
                .get("/api/courses")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body.should.have.length(0);


                    done();
                });
        });
    });

    describe('POST /api/courses', () => {
        it('201 Creating Course', (done) => {
            const data = {
                courseName: "Syslöjd med React",
                points: 15,
                courseResponsible: "msc",
            }


            request.execute(server)
                .post("/api/courses")
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("_id");

                    done();
                });
        });

        it('200 Fetching the newly created course', (done) => {
            request.execute(server)
                .get("/api/courses")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body.should.have.length(1);
                    res.body[0].should.be.an("object");
                    res.body[0].courseName.should.equal("Syslöjd med React");


                    done();
                });
        });
    });
});
