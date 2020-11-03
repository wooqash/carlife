<?php
$mailToSend = 'biuro@carlifecygulski.pl';
$reCaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';
$secret = '6Lfu4doZAAAAAB5pnFYm5qeO0Td8Xne4bQw-wz_T';
$processed = false;
$ERROR_MESSAGE = '';
// echo $_SERVER['REQUEST_METHOD'];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['res_user_name'];
    $phoneNo = $_POST['res_user_phoneno'];
    $email = $_POST['res_user_email'];
    $service = $_POST['res_services'];
    $towingFrom = $_POST['res_towing-from'];
    $towingTo = $_POST['res_towing-to'];
    $date = $_POST['res_date'];
    $fault = $_POST['res_fault'];
    $consent = $_POST['res_consent'];
    $token = $_POST['res_token'];
    $reservationDate = date("d-m-Y H:i:s");
    $antiSpam = $_POST["honey"];

    $errors = array();
    $return = array();

    if (empty($username)) {
        array_push($errors, 'name');
    }
    if (empty($phoneNo)) {
        array_push($errors, 'phoneNo');
    }
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        array_push($errors, 'email');
    }
    if (empty($service)) {
        array_push($errors, 'service');
    }
    if (empty($consent)) {
        array_push($errors, 'consent');
    }
    if (empty($token)) {
        array_push($errors, 'token');
    }
    if (empty($antiSpam)) {
        if (count($errors) > 0) {
            $return['errors'] = $errors;
        } else {
            $data = array('secret' => $secret, 'response' => $token);
            $json = CallAPI('POST', $reCaptchaUrl, $data);
    
            $obj = json_decode($json);
    
            // print_r($obj);
    
            if ($obj->{'code'} == '1') {
                $processed = true;
            } else {
                $ERROR_MESSAGE = $obj->{'data'};
            }
    
            // echo $ERROR_MESSAGE;
    
            if (!$processed && $ERROR_MESSAGE != '') {
                // echo $ERROR_MESSAGE;
                $return['status'] = 'error';
            } else {
                $headers = 'MIME-Version: 1.0' . "\r\n";
                $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
                $headers .= 'From: ' . $email . "\r\n";
                $headers .= 'Reply-to: ' . $email;
                $message = "
                    <html>
                        <head>
                            <meta charset=\"utf-8\">
                        </head>
                        <style type='text/css'>
                            body {font-family:sans-serif; color:#000000; padding:20px;}
                            div {margin-bottom:10px;}
                            .msg-title {margin-top:30px;}
                            table {
                                border-collapse: collapse;
                            }
                            
                            tr:nth-child(odd) {
                                background: #90cc00;
                            }
                            
                            tr:nth-child(even) {
                                background: #c6ff00;
                            }
                            
                            td, th {
                                border: 2px solid #000;
                                padding: 15px;
                                text-align: left;
                            }
                            
                            td:nth-child(1) {
                                font-size: 12px;
                                font-weight: bold;
                                text-transform: uppercase;
                            }
                            
                            td:nth-child(2) {
                                font-size: 14px;
                            }
                            a { text-decoration: underline; color: #000000; }
                        </style>
                        <body>
                            <table>
                                <tr>
                                    <td>Data wysłania zapytania</td>
                                    <td>$reservationDate</td>
                                </tr>
                                <tr>
                                    <td>Klient</td>
                                    <td>$username</td>
                                </tr>
                                <tr>
                                    <td>Telefon</td>
                                    <td>$phoneNo</td>
                                </tr>
                                ".($email ? "
                                <tr>
                                    <td>Email</td>
                                    <td><a href=\"mailto:$email\">$email</a></td>
                                </tr>
                                " : "")."
                                <tr>
                                    <td>Rodzaj usługi</td>
                                    <td>$service</td>
                                </tr>
                                ".($towingFrom ? "
                                <tr>
                                    <td>Adres odbioru pojazdu</td>
                                    <td>$towingFrom</td>
                                </tr>
                                " : "")."
                                ".($towingTo ? "
                                <tr>
                                    <td>Adres dostarczenia pojazdu</td>
                                    <td>$towingTo</td>
                                </tr>
                                " : "")."
                                ".($date ? "
                                <tr>
                                    <td>Preferowany termin wykonania usługi</td>
                                    <td>$date</td>
                                </tr>
                                " : "")."
                                ".($fault ? "
                                <tr>
                                    <td>Opis usterki</td>
                                    <td>$fault</td>
                                </tr>
                                " : "")."
                            </table>
                        </body>
                    </html>";
    
                if (mail($mailToSend,   $service .' - zapytanie o rezerwację terminu', $message, $headers)) {
                    $return['status'] = 'ok';
                } else {
                    $return['status'] = 'error';
                }
            }
        }
    } else {
        $return["status"] = "ok";
    }
    

    header('Content-Type: application/json');
    // echo json_encode($return);
}

// Method: POST, PUT, GET etc
// Data: array("param" => "value") ==> index.php?param=value

function CallAPI($method, $url, $data = false)
{
    $curl = curl_init();

    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data) {
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            }

            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data) {
                $url = sprintf("%s?%s", $url, http_build_query($data));
            }

    }

    // Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_USERPWD, "username:password");

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}
