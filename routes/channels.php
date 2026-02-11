<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('status-pendaftaran', function ($user = null) {
    // Public channel - return true so frontend can listen without auth
    return true;
});
