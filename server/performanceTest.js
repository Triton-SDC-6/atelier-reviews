import http from 'k6/http';
import { sleep, check } from 'k6'

export const options = {
  stages: [
    { duration: '5s', target: 1000 },
    { duration: '1s', target: 1000 },
    { duration: '5s', target: 0 },

  ]
}

export default () => {
  const res = http.get(`http://localhost:3000/reviews/meta/?product_id=${Math.floor(Math.random() * 1000) + 5773900}`);
  check(res, { '200': (r) => r.status === 200 });
  sleep(1)

}