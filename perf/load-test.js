// k6 load-test skeleton. Run manually: `k6 run perf/load-test.js`
// Points at jsonplaceholder by default — swap BASE_URL for your system under test.
// Not wired into CI on purpose: load tests belong on a dedicated environment,
// not on every PR (and never against third-party services).
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

export const options = {
  stages: [
    { duration: '15s', target: 5 },  // ramp up
    { duration: '30s', target: 5 },  // plateau
    { duration: '15s', target: 0 },  // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'], // fail the run if p95 exceeds 800ms
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/posts/1`);
  check(res, { 'status is 200': r => r.status === 200 });
  sleep(1);
}
