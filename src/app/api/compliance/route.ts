import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

interface ComplianceScreeningPayload {
    address: string
    chain: string
    idempotencyKey: string
}

interface CircleAPIError {
    error: string
    success?: boolean
    isApproved?: boolean
    data?: unknown
}

export async function POST(request: NextRequest) {
    try {
        const { address } = await request.json()


        if (!address) {
            return NextResponse.json<CircleAPIError>(
                { error: 'Missing required fields: address and chain are required', success: false }, { status: 400 }
            )
        }

        const chain = 'ETH-SEPOLIA'

        const idempotencyKey = uuidv4()

        const payload: ComplianceScreeningPayload = {
            idempotencyKey,
            address,
            chain
        }

        const circleApiKey = process.env.CIRCLE_API_KEY
        if (!circleApiKey) {
            return NextResponse.json<CircleAPIError>(
                { error: 'Server configuration error: missing Circle API key' },
                { status: 500 }
            )
        }

        const complianceEnable = process.env.ENABLE_COMPLIANCE_CHECK === 'true'
        if (!complianceEnable) {
            console.log('Compliance screening is disabled. Skipping API call.')
            return NextResponse.json({ result: 'Compliance screening is disabled', success: true, isApproved: true, data: { result: "APPROVED", message: "Compliance screening is disabled" } }, { status: 200 })
        }

        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${circleApiKey}`
            },
            body: JSON.stringify({ ...payload, chain: payload.chain })
        }

        const response = await fetch('https://api.circle.com/v1/w3s/compliance/screening/addresses', options)
        const data = await response.json()

        const isApproved = data?.data?.result === 'APPROVED'
        return NextResponse.json({ success: true, isApproved, data: data?.data }, { status: 200 })

    } catch (error) {
        console.error('Compliance screening error:', error)
        return NextResponse.json<CircleAPIError>(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}