@extends('layouts.app')

@section('content')
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet" type="text/css">

    <!-- Main jumbotron for a primary marketing message. the style tag is a special hack/exception to override the layout margin
    for the jumbotron-->
    <link rel="stylesheet" href="/css/home.css">
    <div class="jumbotron" id="jumbotron" style="margin-top: -21px">
        <div class="container" id="container">
            <h1>Campus Room Finder</h1>
            <p><strong>A simple way to find available rooms in all of the NSCC Campuses</strong></p>
            <p><a class="btn btn-primary btn-lg" href="/FreeRoom" role="button">Try It Out &raquo;</a></p>
        </div>
    </div>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2>About this Site</h2>
                    <hr class="star-primary">
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-lg-offset-2">
                    <p> This website lets you search for classrooms, labs, meeting rooms and others within the Nova Scotia
                        Community College (NSCC) campuses. It was initially designed for NSCC students looking to find a free place to study
                        or work at a computer outside of classes which can be sometimes difficult.
                    </p>
                </div>
                <div class="col-lg-4">
                    <p>The site saves the headache of hunting around buildings for a free room, disrupting classes and wasting time.</p>
                    <p style="color: #660000"><strong>Please Note:</strong> the scheduling information data on this site is no longer accurate;
                        it is here for demonstation purposes only.</p>
                </div>
            </div>
        </div>
    </section>
    <!-- About Section -->
    <section class="success" id="about">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2>About the Project</h2>
                    <hr class="star-light">
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2">
                    <p>The website was created as part of a group project by NSCC students, Ryan Sutcliffe, Nick Bourque and Michael Sturdy
                    for their independent study Capstone Project in the winter of 2017.</p>
                    <h3><strong>Why NSCC Sucks?</strong></h3>
                    <p>The current website name is a friendly jab at the NSCC PeopleSoft group who are still ignoring our team&#39s
                        and faculty advisors&#39 requests for access to scheduling and meeting room data. We are still waiting for even
                        a boilerplate &#34please go away&#34 response from anyone in that elusive bureaucratic black hole.</p>
                    <p>Thanks to Christopher Scott in the NSCC Scheduling department who was able get us exported text file snapshots
                        of classroom bookings data and some of the meeting room data for campuses as a workaround.
                        In lieu of direct access to a live database we transformed, loaded and synced these snapshots
                        into our own backend database and used that information for the website instead.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <footer class="text-center">
        <div class="footer-below">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        Absolutely no Copyright © 2017
                    </div>
                </div>
            </div>
        </div>

    </footer>



@endsection