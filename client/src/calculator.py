import requests
import xml.etree.ElementTree as ET

def get_step_by_step_solution_and_related_queries(query, appid):
    # WolframAlpha API URL
    url = "http://api.wolframalpha.com/v2/query"

    # Parameters
    params = {
        "input": query,
        "appid": appid,
        "format": "plaintext",
        "podstate": "Step-by-step solution"
    }

    # Make the request
    response = requests.get(url, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the XML response
        root = ET.fromstring(response.content)

        # Extract step-by-step solution
        results_found = False
        for pod in root.findall(".//pod"):
            title = pod.attrib.get('title', '')
            if title == "Results":
                for subpod in pod.findall(".//subpod"):
                    subpod_title = subpod.attrib.get('title', '')
                    if "Possible intermediate steps" in subpod_title:
                        # Extract and print the plaintext content of the steps
                        step_text = subpod.find('plaintext').text
                        if step_text:
                            print(f"Step-by-Step Solution for query '{query}':\n")
                            print(step_text)
                            results_found = True
                            break
            if results_found:
                break

        if not results_found:
            print(f"No step-by-step solution found for query '{query}'.")

        # Extract related queries
        related_queries_url = root.attrib.get('related', '')
        if related_queries_url:
            print(f"\nLink: {related_queries_url}\n")
            print(f"\nRelated queries for '{query}':\n")
            try:
                # Fetch the related queries XML
                related_response = requests.get(related_queries_url)
                if related_response.status_code == 200:
                    related_root = ET.fromstring(related_response.content)
                    for related_query in related_root.findall(".//relatedquery"):
                        query_text = related_query.text.strip()
                        if query_text:
                            print(f"- {query_text}")
                else:
                    print("Error fetching related queries.")
            except Exception as e:
                print(f"Error fetching related queries: {e}")
    else:
        print(f"Error: {response.status_code}")

# Your API key
appid = "645P2V-93KRPKQUKE"

# List of queries to test
queries = [
    "solve x^2 - 4x + 4 = 0"
]

# Process each query
for query in queries:
    get_step_by_step_solution_and_related_queries(query, appid)
    print("\n" + "="*50 + "\n")  # Separator for readability
