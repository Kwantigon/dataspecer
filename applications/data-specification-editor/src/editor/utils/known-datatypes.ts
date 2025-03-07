import {LanguageString} from "@dataspecer/core/core";

export interface KnownDatatype {
    label?: LanguageString;
    prefix?: string;
    localPart?: string;
    documentation?: string;
    iri: string;
}

export const knownDatatypes: KnownDatatype[] = [
    {
        "iri": "http://www.w3.org/2000/01/rdf-schema#Literal",
        "documentation": "http://www.w3.org/2000/01/rdf-schema#Literal",
        "label": {
            "cs": "Jakýkoli typ",
            "en": "Any type"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#boolean",
        "documentation": "https://ofn.gov.cz/základní-datové-typy/2020-07-01/#boolean",
        "label": {
            "cs": "Booleovská hodnota - Ano či ne",
            "en": "Boolean"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#date",
        "documentation": "https://ofn.gov.cz/základní-datové-typy/2020-07-01/#datum",
        "label": {
            "cs": "Datum",
            "en": "Date"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#time",
        "documentation": "https://ofn.gov.cz/základní-datové-typy/2020-07-01/#čas",
        "label": {
            "cs": "Čas",
            "en": "Time"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#dateTime",
        "documentation": "https://ofn.gov.cz/základní-datové-typy/2020-07-01/#datum-a-čas",
        "label": {
            "cs": "Datum a čas",
            "en": "Date and time"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#gYear",
        "documentation": "http://www.w3.org/2001/XMLSchema#gYear",
        "label": {
            "cs": "Gregoriánský rok",
            "en": "Gregorian year"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#integer",
        "documentation": "https://ofn.gov.cz/základní-datové-typy/2020-07-01/#celé-číslo",
        "label": {
            "cs": "Celé číslo",
            "en": "Integer"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
        "documentation": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
        "label": {
            "cs": "Nezáporné celé číslo",
            "en": "Non-negative integer"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#decimal",
        "documentation": "https://ofn.gov.cz/základní-datové-typy/2020-07-01/#desetinné-číslo",
        "label": {
            "cs": "Desetinné číslo",
            "en": "Decimal number"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#duration",
        "documentation": "http://www.w3.org/2001/XMLSchema#duration",
        "label": {
            "cs": "Doba trvání",
            "en": "Duration"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#anyURI",
        "documentation": "https://ofn.gov.cz/základní-datové-typy/2020-07-01/#url",
        "label": {
            "cs": "URI, IRI, URL",
            "en": "URI, IRI, URL"
        }
    },
    // Normal string
    {
        "iri": "http://www.w3.org/2001/XMLSchema#string",
        "documentation": "https://ofn.gov.cz/základní-datové-typy/2020-07-01/#řetězec",
        "label": {
            "cs": "Řetězec",
            "en": "String"
        }
    },
    // Dictionary with one string per key=language
    {
        "iri": "https://ofn.gov.cz/zdroj/základní-datové-typy/2020-07-01/text",
        "documentation": "https://ofn.gov.cz/základní-datové-typy/2020-07-01/#text",
        "label": {
            "cs": "Text",
            "en": "Text"
        }
    },
    // RDF language string - string with given language tag
    {
        "iri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
        "documentation": "https://www.w3.org/TR/rdf11-schema/#ch_langstring",
        "label": {
            "cs": "Řetězec anotovaný jazykem",
            "en": "Language tagged string"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#base64Binary",
        "documentation": "https://www.w3.org/TR/xmlschema-2/#base64Binary",
        "label": {
            "cs": "Base64 kódovaný binární obsah",
            "en": "Base64 encoded binary content"
        }
    },
    {
        "iri": "http://www.w3.org/2001/XMLSchema#hexBinary",
        "documentation": "https://www.w3.org/TR/xmlschema-2/#hexBinary",
        "label": {
            "cs": "Hex kódovaný binární obsah",
            "en": "Hex encoded binary content"
        }
    },
];
