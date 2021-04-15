import React from 'react';
import Login from "./Login";
import {render} from "@testing-library/react";
import ReactDOM from 'react-dom';

test('renders learn react link', () => {
    render(<Login />);
    const div = document.createElement("div");
    ReactDOM.render( <Login />, div)
});
