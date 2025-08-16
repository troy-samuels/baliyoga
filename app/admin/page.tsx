"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  useEffect(() => {
    checkSupabaseDashboard()
  }, [])

  const checkSupabaseDashboard = () => {
    // Open Supabase dashboard in new tab
    window.open("https://supabase.com/dashboard/project/zioqkkdhvgrkznxyxtik", "_blank")
  }

  const findMissingData = async () => {
    setIsLoading(true)
    setDebugInfo("🔍 Searching all tables for missing data...")

    try {
      const response = await fetch("/api/debug/missing-data")
      const result = await response.json()

      const info = `🔍 MISSING DATA CHECK:

${result
  .map(
    (table: any) => `
📊 TABLE: ${table.tableName}
  Missing Data: ${table.missingData ? "❌ YES" : "✅ No"}
  Missing Columns: ${table.missingColumns.length > 0 ? table.missingColumns.join(", ") : "None"}
`,
  )
  .join("\n")}

🚨 NEXT STEPS:
1. Add the missing data to the tables
2. Add the missing columns to the tables`

      setDebugInfo(info)
    } catch (error) {
      setDebugInfo(`❌ Error checking missing data: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkProject = async () => {
    setIsLoading(true)
    setDebugInfo("🏗️ Verifying project setup...")

    try {
      const response = await fetch("/api/debug/project-check")
      const result = await response.json()

      const info = `🏗️ PROJECT VERIFICATION:

✅ Project ID: ${result.projectId}
✅ Table Name: ${result.tableName}
✅ Column Names: ${result.columnNames.join(", ")}
✅ Row Count: ${result.rowCount}

🚨 NEXT STEPS:
1. Verify that the project ID is correct
2. Verify that the table name is correct
3. Verify that the column names are correct
4. Verify that the row count is greater than 0`

      setDebugInfo(info)
    } catch (error) {
      setDebugInfo(`❌ Error verifying project: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkRLS = async () => {
    setIsLoading(true)
    setDebugInfo("🔒 Checking Row Level Security...")

    try {
      const response = await fetch("/api/debug/rls-check")
      const result = await response.json()

      const info = `🔒 ROW LEVEL SECURITY CHECK:

📊 TABLE ACCESS TEST:
  Table Name: "${result.tableName}"
  Can Read Data: ${result.tests.anonAccess.canRead ? "✅" : "❌"}
  Records Found: ${result.tests.anonAccess.recordCount}
  Error: ${result.tests.anonAccess.error || "None"}
  Error Code: ${result.tests.anonAccess.errorCode || "None"}

🔍 DIAGNOSIS:
  RLS Blocking Access: ${result.diagnosis.isRLSBlocking ? "🚨 YES" : "✅ No"}
  Table Accessible: ${result.diagnosis.tableAccessible ? "✅" : "❌"}
  Has Data: ${result.diagnosis.hasData ? "✅" : "❌"}

${
  result.solution
    ? `
🔧 SOLUTION FOUND:
Problem: ${result.solution.problem}

Steps to Fix:
${result.solution.steps.map((step: string) => `  ${step}`).join("\n")}

🌐 Quick Links:
  • Policies Dashboard: https://supabase.com/dashboard/project/zioqkkdhvgrkznxyxtik/auth/policies
  • Table Editor: https://supabase.com/dashboard/project/zioqkkdhvgrkznxyxtik/editor

💡 RECOMMENDED ACTION:
Go to your Supabase dashboard and either:
1. DISABLE RLS for this table (easiest for development)
2. CREATE a policy to allow public read access
`
    : "✅ No RLS issues detected"
}

🚨 NEXT STEPS:
${
  result.diagnosis.isRLSBlocking
    ? "1. Click the 'Fix RLS' button below, OR\n  2. Go to Supabase dashboard and disable RLS manually"
    : "RLS is not the issue. The problem might be elsewhere."
}`

      setDebugInfo(info)
    } catch (error) {
      setDebugInfo(`❌ Error checking RLS: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const fixRLS = async () => {
    setIsLoading(true)
    setDebugInfo("🔧 Attempting to fix RLS...")

    try {
      const response = await fetch("/api/debug/fix-rls", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        setDebugInfo(`✅ RLS FIXED SUCCESSFULLY!

Your table should now be accessible. Try refreshing your app to see the data.

${result.message}`)
      } else {
        setDebugInfo(`❌ Could not fix RLS automatically.

${result.error}

🔧 MANUAL STEPS:
${result.manualSteps.map((step: string) => `  ${step}`).join("\n")}

🌐 Direct Link: https://supabase.com/dashboard/project/zioqkkdhvgrkznxyxtik/auth/policies`)
      }
    } catch (error) {
      setDebugInfo(`❌ Error fixing RLS: ${error instanceof Error ? error.message : "Unknown error"}

Please fix manually:
1. Go to https://supabase.com/dashboard/project/zioqkkdhvgrkznxyxtik/auth/policies
2. Find your table 'Bali Yoga Studios and Retreats'
3. Click 'Disable RLS'`)
    } finally {
      setIsLoading(false)
    }
  }

  const testDataAccess = async () => {
    setIsLoading(true)
    setDebugInfo("🎉 Testing data access after RLS fix...")

    try {
      // Test the API endpoints
      const [studiosResponse, retreatsResponse] = await Promise.all([fetch("/api/studios"), fetch("/api/retreats")])

      const studios = await studiosResponse.json()
      const retreats = await retreatsResponse.json()

      // Test direct Supabase access
      const directResponse = await fetch("/api/debug/rls-check")
      const directResult = await directResponse.json()

      const info = `🎉 DATA ACCESS TEST RESULTS:

📊 API ENDPOINTS:
  Studios API: ${studiosResponse.ok ? "✅" : "❌"} (${studios.length || 0} records)
  Retreats API: ${retreatsResponse.ok ? "✅" : "❌"} (${retreats.length || 0} records)
  Total Records: ${(studios.length || 0) + (retreats.length || 0)}

🔍 DIRECT DATABASE ACCESS:
  Can Read Table: ${directResult.tests?.anonAccess?.canRead ? "✅" : "❌"}
  Records Found: ${directResult.tests?.anonAccess?.recordCount || 0}
  Error: ${directResult.tests?.anonAccess?.error || "None"}

🎯 DIAGNOSIS:
${
  (studios.length || 0) + (retreats.length || 0) > 0
    ? `✅ SUCCESS! Found ${(studios.length || 0) + (retreats.length || 0)} total records.
  
  Your data is now accessible! 🎉
  
  Studios found: ${studios.length || 0}
  Retreats found: ${retreats.length || 0}
  
  You can now visit:
  • /studios - to see all studios
  • /retreats - to see all retreats
  • / - to see the homepage with data`
    : `❌ Still no data found. Possible issues:
  
  1. Data might be in a different table
  2. Category filters might not match your data
  3. Data might have been deleted
  
  Let's check what categories exist in your data...`
}

${
  studios.length > 0
    ? `
📋 SAMPLE STUDIOS:
${studios
  .slice(0, 3)
  .map((studio: any) => `  • ${studio.name} (${studio.location})`)
  .join("\n")}`
    : ""
}

${
  retreats.length > 0
    ? `
📋 SAMPLE RETREATS:
${retreats
  .slice(0, 3)
  .map((retreat: any) => `  • ${retreat.name} (${retreat.location})`)
  .join("\n")}`
    : ""
}`

      setDebugInfo(info)
    } catch (error) {
      setDebugInfo(`❌ Error testing data access: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {/* Quick Links */}
      <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">📊 Analytics & Management</h3>
        <div className="flex flex-wrap gap-3">
          <a 
            href="/admin/analytics" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📈 Analytics Dashboard
          </a>
          <a 
            href="/admin/blog" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📝 Blog Management
          </a>
          <button 
            onClick={checkSupabaseDashboard}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🌐 Supabase Dashboard
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Database Debugger</h2>

      <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
        <h3 className="font-semibold text-red-800 mb-2">🚨 Most Likely Issue: Row Level Security (RLS)</h3>
        <p className="text-sm text-red-700">
          Your environment variables are correct and you're connected to the right project. The table exists but shows 0
          records, which typically means <strong>Row Level Security is blocking API access</strong>.
        </p>
        <ul className="text-sm text-red-700 mt-2 space-y-1">
          <li>• ✅ Correct project: zioqkkdhvgrkznxyxtik</li>
          <li>• ✅ Correct table name: "Bali Yoga Studios and Retreats"</li>
          <li>• ✅ Valid environment variables</li>
          <li>• ❌ RLS is likely blocking the anon key from reading data</li>
        </ul>
        <p className="text-sm text-red-700 mt-2 font-medium">Click "🔒 Check RLS" to confirm this diagnosis.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Button onClick={testDataAccess} disabled={isLoading} className="bg-green-600 text-white hover:bg-green-700">
          🎉 Test Data Access
        </Button>
        <Button onClick={findMissingData} disabled={isLoading} className="bg-red-600 text-white hover:bg-red-700">
          🔍 Search All Tables
        </Button>
        <Button onClick={checkProject} disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
          🏗️ Verify Project
        </Button>
        <Button onClick={checkRLS} disabled={isLoading} className="bg-orange-600 text-white hover:bg-orange-700">
          🔒 Check RLS
        </Button>
        <Button onClick={fixRLS} disabled={isLoading} className="bg-purple-600 text-white hover:bg-purple-700">
          🔧 Fix RLS
        </Button>
        <Button onClick={checkSupabaseDashboard} className="bg-gray-600 text-white hover:bg-gray-700">
          🌐 Open Dashboard
        </Button>
      </div>

      {debugInfo && (
        <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Debug Information</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}
    </div>
  )
}
