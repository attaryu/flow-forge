/**
 * FlowForge Workflow Schema
 *
 * Revisi berdasarkan business-logic.md dan architecture-decision.md.
 * Ringkasan perubahan ada di CHANGELOG di bagian bawah file ini.
 */
export const workflowSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	title: 'Workflow',
	type: 'object',
	required: ['name', 'definition'],
	properties: {
		name: {
			type: 'string',
			minLength: 1,
			maxLength: 255, // selaras dengan workflows.name VARCHAR(255) di database-schema.md
			description: 'The name of the workflow',
		},
		description: {
			type: 'string',
			description: 'An optional description of what the workflow does',
		},
		definition: {
			type: 'object',
			required: ['nodes', 'edges'],
			properties: {
				nodes: {
					type: 'array',
					minItems: 1, // workflow kosong tidak valid
					description: 'List of nodes in the workflow',
					items: {
						type: 'object',
						required: ['id', 'type', 'config'],
						properties: {
							id: {
								type: 'string',
								description: 'Unique identifier for the node',
							},
							type: {
								type: 'string',
								enum: [
									'HTTP_CALL',
									'DELAY',
									'CONDITIONAL_BRANCH',
									'DATA_TRANSFORM',
								],
								description: 'The type of execution node',
							},
							config: {
								type: 'object',
								description: 'Configuration specific to the node type',
							},
						},
						allOf: [
							{
								if: {
									properties: {
										type: { const: 'HTTP_CALL' },
									},
								},
								then: {
									properties: {
										config: {
											type: 'object',
											required: ['url', 'method'],
											properties: {
												url: {
													type: 'string',
													format: 'uri',
													description:
														'The HTTP URL to call. Validated at save-time to prevent injection (per business-logic.md §7).',
												},
												method: {
													type: 'string',
													enum: ['GET', 'POST'],
													description:
														"The HTTP method ('Ambil'/'Kirim')",
												},
												headers: {
													type: 'object',
													description:
														'HTTP request headers as key-value pairs',
													additionalProperties: { type: 'string' },
												},
												payload: {
													type: 'string',
													description:
														'HTTP request body/payload, used when method is POST ("jika Kirim")',
												},
											},
										},
									},
								},
							},
							{
								if: {
									properties: {
										type: { const: 'DELAY' },
									},
								},
								then: {
									properties: {
										config: {
											type: 'object',
											required: ['seconds'],
											properties: {
												seconds: {
													type: 'integer',
													minimum: 1,
													maximum: 86400,
													description:
														'Number of seconds to delay execution (1 to 86400 / 24 jam). Non-blocking: dijadwalkan lewat BullMQ job delay, bukan sleep().',
												},
											},
										},
									},
								},
							},
							{
								if: {
									properties: {
										type: { const: 'CONDITIONAL_BRANCH' },
									},
								},
								then: {
									properties: {
										config: {
											type: 'object',
											required: ['operator', 'left', 'right'],
											properties: {
												operator: {
													type: 'string',
													enum: [
														'EQUALS',
														'NOT_EQUALS',
														'GREATER_THAN',
														'CONTAINS',
													],
													description:
														'Comparison operator (EQUALS/NOT_EQUALS: nilai persis sama/tidak sama; GREATER_THAN: perbandingan angka; CONTAINS: substring teks)',
												},
												left: {
													type: 'string',
													description:
														'Left operand value or variable placeholder (e.g. ${node-id.status})',
												},
												right: {
													type: 'string',
													description:
														'Right operand value to compare against',
												},
											},
										},
									},
								},
							},
							{
								if: {
									properties: {
										type: { const: 'DATA_TRANSFORM' },
									},
								},
								then: {
									properties: {
										config: {
											type: 'object',
											required: ['mode'],
											properties: {
												mode: {
													type: 'string',
													enum: ['simple', 'advanced'],
													description: 'The transformation mode',
												},
												operation: {
													type: 'string',
													enum: [
														// Teks
														'CONCAT',
														'SUBSTRING',
														'UPPERCASE',
														'LOWERCASE',
														'TRIM',
														// Matematika
														'ADD',
														'SUBTRACT',
														'MULTIPLY',
														'DIVIDE',
														'MODULO',
													],
													description:
														'Required when mode is "simple". Operasi predefinisi (Gabung, Ambil substring, Huruf besar, Huruf kecil, Hapus spasi, Tambah, Kurang, Kali, Bagi, Modulo) sesuai business-logic.md §3.',
												},
												inputs: {
													type: 'array',
													minItems: 1,
													description:
														'Required when mode is "simple". Operand untuk operasi di atas, dalam urutan sesuai kebutuhan operasi (mis. CONCAT/ADD butuh 2+ input, UPPERCASE cukup 1). Boleh berupa nilai literal atau referensi ${nodeId.field}.',
													items: {
														type: 'object',
														required: ['value'],
														properties: {
															value: { type: 'string' },
														},
													},
												},
												expression: {
													type: 'string',
													description:
														'Required when mode is "advanced". Ekspresi tanpa kode bebas/loop — mendukung operator matematika (+ - * / %), perbandingan (== != < > <= >=), logika (&& || !), kondisional (cond ? a : b), dan akses object (${node-id.field}) sesuai business-logic.md §3.',
												},
											},
											allOf: [
												{
													if: {
														properties: { mode: { const: 'simple' } },
													},
													then: {
														required: ['operation', 'inputs'],
													},
												},
												{
													if: {
														properties: { mode: { const: 'advanced' } },
													},
													then: {
														required: ['expression'],
													},
												},
											],
										},
									},
								},
							},
						],
					},
				},
				edges: {
					type: 'array',
					minItems: 0,
					description:
						'List of connections/edges between nodes. Catatan: JSON Schema tidak bisa memvalidasi aturan graf lintas-array (no-cycle, dan CONDITIONAL_BRANCH wajib punya persis 1 edge "true" + 1 edge "false") — ini divalidasi di application layer memakai graphology-dag saat save, sesuai architecture-decision.md §5.',
					items: {
						type: 'object',
						required: ['from', 'to'],
						properties: {
							from: {
								type: 'string',
								description: 'The ID of the source node',
							},
							to: {
								type: 'string',
								description: 'The ID of the target node',
							},
							sourceHandle: {
								type: 'string',
								enum: ['true', 'false'],
								description:
									"Required for edges originating from a CONDITIONAL_BRANCH node: indicate 'true' or 'false' path. Diabaikan/tidak dipakai untuk node non-percabangan.",
							},
						},
					},
				},
			},
		},
	},
};
