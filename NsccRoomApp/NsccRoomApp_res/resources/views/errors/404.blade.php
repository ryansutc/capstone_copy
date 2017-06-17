@extends('layouts.app')

@section('content')
{{--<head>--}}
    {{--<title>404</title>--}}

    {{--<link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">--}}

    <style>
        html, body {
            height: 100%;
        }

        .fourohfour {
            margin: 0;
            padding: 0;
            width: 100%;
            color: #B0BEC5;
            display: table;
            font-weight: 100;
            font-family: 'Lato';
        }

        .container {
            text-align: center;
            display: table-cell;
            vertical-align: middle;
        }

        .content {
            text-align: center;
            display: inline-block;
        }

        .title {
            font-size: 72px;
            margin-bottom: 40px;
        }
    </style>
{{--</head>--}}
{{--<body>--}}
<div class="fourohfour">
    <div class="container">
        <div class="content">
            <div class="title">404 Page Not Found...<br/>Uh oh, you don't belong here!</div>
        </div>
    </div>
</div>
@endsection