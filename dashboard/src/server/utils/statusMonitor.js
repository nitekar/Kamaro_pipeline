// Simple in-memory API status monitor
// Status metrics
let metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  startTime: new Date().toISOString(),
  lastRequest: null,
  responseTimeAvg: 0,
  requestsPerMinute: 0,
  statusCodes: {},
  endpoints: {}
};
// Track requests per minute
const requestsHistory = [];
const MINUTE = 60 * 1000;
// Calculate requests per minute
setInterval(() => {
  const now = Date.now();
  const oneMinuteAgo = now - MINUTE;
  // Remove old requests
  while (requestsHistory.length > 0 && requestsHistory[0] < oneMinuteAgo) {
    requestsHistory.shift();
  }
  // Update metric
  metrics.requestsPerMinute = requestsHistory.length;
}, 5000);
// Request tracking middleware
function trackRequest(req, res, next) {
  const startTime = Date.now();
  // Store request timestamp for RPM calculation
  requestsHistory.push(startTime);
  // Track the request
  metrics.totalRequests++;
  metrics.lastRequest = new Date().toISOString();
  // Initialize endpoint tracking if needed
  const endpoint = `${req.method} ${req.path}`;
  if (!metrics.endpoints[endpoint]) {
    metrics.endpoints[endpoint] = {
      count: 0,
      responseTimeAvg: 0,
      lastCalled: null
    };
  }
  // Track endpoint metrics
  metrics.endpoints[endpoint].count++;
  metrics.endpoints[endpoint].lastCalled = new Date().toISOString();
  // Capture response data
  const originalEnd = res.end;
  res.end = function () {
    // Calculate response time
    const responseTime = Date.now() - startTime;
    // Update average response time
    const prevTotalTime = metrics.responseTimeAvg * (metrics.totalRequests - 1);
    metrics.responseTimeAvg = (prevTotalTime + responseTime) / metrics.totalRequests;
    // Update endpoint response time
    const endpointData = metrics.endpoints[endpoint];
    const prevEndpointTotalTime = endpointData.responseTimeAvg * (endpointData.count - 1);
    endpointData.responseTimeAvg = (prevEndpointTotalTime + responseTime) / endpointData.count;
    // Track status code
    const statusCode = res.statusCode;
    metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;
    // Track success/failure
    if (statusCode >= 200 && statusCode < 400) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }
    originalEnd.apply(res, arguments);
  };
  next();
}
// Get current status
function getStatus() {
  return {
    ...metrics,
    uptime: (new Date() - new Date(metrics.startTime)) / 1000,
    successRate: metrics.totalRequests > 0 ? metrics.successfulRequests / metrics.totalRequests * 100 : 100
  };
}
module.exports = {
  trackRequest,
  getStatus
};