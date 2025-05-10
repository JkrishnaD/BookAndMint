/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/contract.json`.
 */
export type Contract = {
  "address": "CsFsWk5NwBuo7bGbryvyujzrtMnz6458EphQ5xytMMpM",
  "metadata": {
    "name": "contract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addTimeSlot",
      "discriminator": [
        110,
        192,
        251,
        79,
        104,
        133,
        60,
        8
      ],
      "accounts": [
        {
          "name": "organiser",
          "writable": true,
          "signer": true,
          "relations": [
            "experience"
          ]
        },
        {
          "name": "experience",
          "writable": true
        },
        {
          "name": "slot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  108,
                  111,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "experience"
              },
              {
                "kind": "arg",
                "path": "startTime"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "bookSlot",
      "discriminator": [
        233,
        227,
        65,
        37,
        70,
        197,
        216,
        39
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "experience",
          "writable": true
        },
        {
          "name": "slot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  108,
                  111,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "experience"
              },
              {
                "kind": "arg",
                "path": "startTime"
              }
            ]
          }
        },
        {
          "name": "reservation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "experience"
              },
              {
                "kind": "arg",
                "path": "startTime"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "userNftAccount",
          "writable": true
        },
        {
          "name": "organiser",
          "writable": true
        },
        {
          "name": "masterEdition",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "metadata",
          "writable": true
        },
        {
          "name": "metadataProgram"
        },
        {
          "name": "sysvarInstructions"
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "cancelReservation",
      "discriminator": [
        72,
        162,
        75,
        180,
        116,
        157,
        146,
        172
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true,
          "relations": [
            "reservation"
          ]
        },
        {
          "name": "experience",
          "writable": true
        },
        {
          "name": "reservation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "experience"
              },
              {
                "kind": "arg",
                "path": "startTime"
              }
            ]
          }
        },
        {
          "name": "slot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  108,
                  111,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "experience"
              },
              {
                "kind": "arg",
                "path": "startTime"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createExperience",
      "discriminator": [
        67,
        77,
        119,
        157,
        160,
        65,
        150,
        143
      ],
      "accounts": [
        {
          "name": "organiser",
          "writable": true,
          "signer": true
        },
        {
          "name": "experience",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  112,
                  101,
                  114,
                  105,
                  101,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "organiser"
              },
              {
                "kind": "arg",
                "path": "title"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "priceLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateReservation",
      "discriminator": [
        178,
        30,
        244,
        35,
        72,
        22,
        168,
        233
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true,
          "relations": [
            "reservation"
          ]
        },
        {
          "name": "experience",
          "writable": true
        },
        {
          "name": "reservation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "experience"
              },
              {
                "kind": "arg",
                "path": "currentStartTime"
              }
            ]
          }
        },
        {
          "name": "oldSlot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  108,
                  111,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "experience"
              },
              {
                "kind": "arg",
                "path": "currentStartTime"
              }
            ]
          }
        },
        {
          "name": "newSlot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  108,
                  111,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "experience"
              },
              {
                "kind": "arg",
                "path": "newStartTime"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newStartTime",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "experience",
      "discriminator": [
        133,
        155,
        179,
        52,
        242,
        232,
        244,
        240
      ]
    },
    {
      "name": "reservation",
      "discriminator": [
        188,
        235,
        0,
        111,
        208,
        253,
        247,
        212
      ]
    },
    {
      "name": "timeSlotAccount",
      "discriminator": [
        95,
        55,
        238,
        151,
        153,
        53,
        251,
        156
      ]
    }
  ],
  "events": [
    {
      "name": "experienceCreated",
      "discriminator": [
        196,
        125,
        206,
        254,
        38,
        210,
        249,
        162
      ]
    },
    {
      "name": "reservationCancelled",
      "discriminator": [
        30,
        219,
        160,
        193,
        236,
        170,
        17,
        95
      ]
    },
    {
      "name": "reservationCreated",
      "discriminator": [
        26,
        199,
        159,
        99,
        111,
        34,
        211,
        176
      ]
    },
    {
      "name": "reservationUpdated",
      "discriminator": [
        88,
        14,
        193,
        21,
        211,
        70,
        198,
        243
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "metadataCreationFailed",
      "msg": "Failed to create metadata"
    }
  ],
  "types": [
    {
      "name": "experience",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organiser",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "location",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "priceLamports",
            "type": "u64"
          },
          {
            "name": "cancelationFeePercent",
            "type": "u64"
          },
          {
            "name": "timeSlotCount",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "experienceCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organiser",
            "type": "pubkey"
          },
          {
            "name": "experience",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "reservation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "experienceId",
            "type": "pubkey"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "timeSlot",
            "type": "i64"
          },
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "reservationCancelled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "reservation",
            "type": "pubkey"
          },
          {
            "name": "cancellationFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "reservationCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "reservation",
            "type": "pubkey"
          },
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "startTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "reservationUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "reservation",
            "type": "pubkey"
          },
          {
            "name": "newStartTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "timeSlotAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "experience",
            "type": "pubkey"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
          },
          {
            "name": "isBooked",
            "type": "bool"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "booker",
            "type": {
              "option": "pubkey"
            }
          }
        ]
      }
    }
  ]
};
