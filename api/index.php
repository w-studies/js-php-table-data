<?php

require 'helpers/functions.php';
$data = getJsonFromInput();

jsonResponse(['response-from-php' => $data]);
