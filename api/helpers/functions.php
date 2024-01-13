<?php
/**
 * GET JSON FROM INPUT
 *
 * @return void
 */
function getJsonFromInput(bool $associative = false)
{
  // get the raw POSTed data
  $rawData = file_get_contents('php://input');

  // this returns null if not valid json
  return json_decode($rawData, $associative);
}
/**
 * HTTP STATUSCODE
 */
function httpStatusCode(int $code): string
{

  $status = [
    200 => '200 OK',
    400 => '400 Bad Request',
    401 => '401 Unauthorized',
    404 => '404 Not Found',
    422 => 'Unprocessable Entity',
    500 => '500 Internal Server Error',
  ];

  return $status[$code] ?? "Unkown status code: {$code}";
}
/**
 * JSON RESPONSE
 */
function jsonResponse(mixed $data = null, int $code = 200): void
{
  // clear the old headers
  header_remove();
  // set the actual code
  http_response_code($code);

  // treat this as json
  header('Content-Type: application/json');

  // ok, validation error, or failure
  header('Status: '.httpStatusCode($code));

  if ($code !== 200) {
    // guarda os dados do backtrace
    $debug = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1)[0];

    if (is_array($data)) {
      $data['debug'] = $debug;
    } else {
      $data .= "<br/><small class='text-secondary'><b>FILE</b>: $debug[file]<br/><b>LINE</b>: $debug[line]</small>";
    }
  }
  // return the encoded json
  // exit(is_array($data) ? json_encode($data, JSON_PRETTY_PRINT) : '"'.$data.'"');
  exit(json_encode($data));
}
