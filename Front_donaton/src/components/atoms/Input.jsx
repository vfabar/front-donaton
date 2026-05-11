import React from "react";
import { Form } from "react-bootstrap";

function Input({className = "", type = "text", id, ...props}) { //error de id solucionado
    const componentProps = {
        className,
        ...(type === "textarea" ? { as: "textarea" } : { type }),
        ...props,
    };
    return <Form.Control {...componentProps} />;
}

export default Input;